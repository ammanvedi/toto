import express from 'express';
import bodyParser from 'body-parser';
import {MediaIndex} from "../types/MediaIndex";
import {statSync, createReadStream, readFileSync} from 'fs';
import {createMediaIndex} from "./lib/media-index/MediaIndex";
import {FeatureDatabase} from "./lib/database/FeatureDatabase";
import {
    evaluateMediaIndex,
} from "./lib/media-index/EvaluateMediaIndex";
import graphqlHTTP from 'express-graphql';
import {resolve} from 'path';
import { buildSchema } from "graphql";
import {allLibrarySeriesQueryResolver} from "./lib/resolvers/query/AllLibrarySeriesQueryResolver";
import {singleLibrarySeriesQueryResolver} from "./lib/resolvers/query/SingleLibrarySeriesQueryResolver";
import {allLibraryFeatureQueryResolver} from "./lib/resolvers/query/AllLibraryFeaturesQueryResolver";
import {singleLibraryFeatureQueryResolver} from "./lib/resolvers/query/SingleLibraryFeatureQueryResolver";
import {singleSeasonQueryResolver} from "./lib/resolvers/query/SingleSeasonQueryResolver";
import {watchHistoryQueryResolver} from "./lib/resolvers/query/WatchHistoryQueryResolver";
import {trackFeatureWatchMutationResolver} from "./lib/resolvers/mutation/TrackFeatureWatchMutationResolver";
import {
    MutationTrackFeatureWatchArgs,
    MutationTrackSeriesWatchArgs, QuerySingleLibraryFeatureArgs,
    QuerySingleLibrarySeriesArgs, QuerySingleSeasonArgs
} from "../types/Schema";
import {trackSeriesWatchMutationResolver} from "./lib/resolvers/mutation/TrackSeriesWatchMutationResolver";

const port = process.env.TOTO_SERVER_PORT;
const roots = process.env.TOTO_ROOTS;
const formats = process.env.TOTO_FORMATS;

const app = express();
app.use(bodyParser.json());

let mediaIndex: MediaIndex;
const database  = new FeatureDatabase(process.env.TOTO_DB_PORT || '3000');


app.get('/video/:sourceId', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const file = mediaIndex.fileIndex[req.params.sourceId];
    if (file) {
        console.log('received request to serve file', file);
        const { size } = statSync(file);
        const { headers: { range } } = req;

        if (range) {
            const parts = range.replace(/bytes=/, "").split('-');
            const start = parseInt(parts[0]);
            const end = parts[1] ? parseInt(parts[1]) : size - 1;
            const chunkSize = (end - start) + 1;
            const fileStream = createReadStream(file, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            fileStream.pipe(res);

        }
    } else {
        res.status(404).end();
    }
});

setTimeout(() => {
    // allow time for DB to start up
    if (roots && formats) {
        database.connect()
            .then(() => createMediaIndex(roots.split(','), formats.split(',')))
            .then(index => {
                mediaIndex = index;
                return evaluateMediaIndex(index, database);
            })
            .then(() => {

                const schemaPath = resolve( __dirname, '.', 'graphql', 'schema.graphql');
                console.log('Looking for schema at ', schemaPath);
                const schema = readFileSync(schemaPath, {
                    encoding: 'utf-8'
                });

                if (!schema) {
                    console.log('Could not find the schema');
                }

                app.use("/graphql", function (req, res, next) {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
                    if (req.method === 'OPTIONS') {
                        res.sendStatus(200);
                    } else {
                        next();
                    }
                });

                app.use('/graphql', graphqlHTTP({
                    schema: buildSchema(schema),
                    rootValue: {
                        allLibrarySeries: () => allLibrarySeriesQueryResolver(mediaIndex, database),
                        singleLibrarySeries: (args: QuerySingleLibrarySeriesArgs) => singleLibrarySeriesQueryResolver(args.imdbId, database, mediaIndex),
                        allLibraryFeatures: () => allLibraryFeatureQueryResolver(mediaIndex, database),
                        singleLibraryFeature: (args: QuerySingleLibraryFeatureArgs) => singleLibraryFeatureQueryResolver(args.imdbId, database, mediaIndex),
                        singleSeason: (args: QuerySingleSeasonArgs) => singleSeasonQueryResolver(args.seriesId, args.season, mediaIndex, database),
                        watchHistory: () => watchHistoryQueryResolver(database),
                        trackFeatureWatch: (input: MutationTrackFeatureWatchArgs) => trackFeatureWatchMutationResolver(input, database, mediaIndex),
                        trackSeriesWatch: (input: MutationTrackSeriesWatchArgs) => trackSeriesWatchMutationResolver(input, database, mediaIndex)
                    },
                    graphiql: true
                }));

                app.listen(port, () => {
                    console.log('started serving on port', port);
                });
            });
    } else {
        console.log('TOTO_ROOTS or TOTO_FORMATS envars are missing')
    }
}, 5000);






