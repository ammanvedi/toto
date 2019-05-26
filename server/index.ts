import express from 'express';
import bodyParser from 'body-parser';
import {MediaIndex} from "../types/MediaIndex";
import {statSync, createReadStream} from 'fs';
import {createMediaIndex} from "./lib/media-index/MediaIndex";
import {FeatureDatabase} from "./lib/database/FeatureDatabase";
import {
    evaluateMediaIndex,
    getLibraryresponseFromMediaIndex,
    getSeasonResponseFromMediaIndex
} from "./lib/media-index/EvaluateMediaIndex";
import {LibraryWatchHistory} from "../types/Database";

require('dotenv').config();

const port = process.env.TOTO_PORT;
const roots = process.env.TOTO_ROOTS;
const formats = process.env.TOTO_FORMATS;

const app = express();
app.use(bodyParser.json());

let mediaIndex: MediaIndex;
const database  = new FeatureDatabase(process.env.TOTO_MONGO_PORT || '3000');

app.get('/library', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const responseData = await getLibraryresponseFromMediaIndex(mediaIndex, database);
        res.send(JSON.stringify(responseData));
        res.status(200).end();
    } catch (e) {
        console.log(e.stack);
        res.status(500).end();
    }
});

app.get('/library/history', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const responseData = await database.getLibraryWatchHistory();
        res.send(JSON.stringify(responseData));
        res.status(200).end();
    } catch (e) {
        console.log(e.stack);
        res.status(500).end();
    }
});

app.post('/library/history', async (req, res) => {
    try {
        const item = <LibraryWatchHistory> req.body;
        const insertResult = await database.storeLibraryWatchHistoryEntry(item);
        if (insertResult) {
            res.status(200).end();
        } else {
            res.status(500).end();
        }
    } catch (e) {
        console.log(e.stack);
        res.status(500).end();
    }
})

app.get('/library/:id/season/:season', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const responseData = await getSeasonResponseFromMediaIndex(
            req.params.id,
            req.params.season,
            mediaIndex, database
        );
        res.send(JSON.stringify(responseData));
        res.status(200).end();
    } catch {
        res.status(500).end();
    }
});

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
                app.listen(port, () => {
                    console.log('started serving on port', port);
                });
            });
    } else {
        console.log('TOTO_ROOTS or TOTO_FORMATS envars are missing')
    }
}, 5000);






