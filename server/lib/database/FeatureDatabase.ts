import {Collection, Db, MongoClient} from "mongodb";
import {Feature, FeatureEpisode, FeatureType} from "../../../types/OMDB";
import {
    DatabaseFeature,
    DatabaseFeatureEpisode,
    LibraryWatchHistory,
    MovieWatchHistory,
    SeriesWatchHistory
} from "../../../types/Database";
import {
    FeatureWatchHistoryInput,
    LibraryEpisode,
    OmdbEpisode,
    OmdbFeature,
    SeriesWatchHistoryInput,
    WatchHistory
} from "../../../types/Schema";

export class FeatureDatabase {

    private connected: boolean = false;
    private client: MongoClient | null = null;
    private database: Db | null = null;
    private featureCollection: Collection<OmdbFeature> | null = null;
    private featureEpisodeCollection: Collection<OmdbEpisode> | null = null;
    private watchHistoryCollection: Collection<WatchHistory> | null = null;

    private static FEATURES_DB = 'features_db';
    private static FEATURES_COLLECTION = 'features_collection';
    private static FEATURES_EPISODES_COLLECTION = 'features_episodes_collection';
    private static FEATURES_WATCH_HISTORY_COLLECTION = 'features_watch_history';

    constructor(protected port: string, protected dbName: string = FeatureDatabase.FEATURES_DB) {}

    connect(): Promise<void> {
        if (this.connected) {
            return Promise.resolve();
        }
        const connectionString = `mongodb://localhost:${this.port}`;

        return MongoClient.connect(connectionString)
            .then(client => {
                this.client = client;
                this.database = this.client.db(this.dbName);
                this.featureCollection = this.database.collection(FeatureDatabase.FEATURES_COLLECTION);
                this.featureEpisodeCollection = this.database.collection(FeatureDatabase.FEATURES_EPISODES_COLLECTION);
                this.watchHistoryCollection = this.database.collection(FeatureDatabase.FEATURES_WATCH_HISTORY_COLLECTION);
                return;
            });
    }

    // Features (Movies/Series)

    storeFeature(feature: OmdbFeature): Promise<boolean> {
        if (!this.featureCollection) {
            return Promise.reject();
        }
        console.log('Storing feature', feature.title);
        return this.featureCollection.insertOne(feature)
            .then(result => {
                return result.insertedCount === 1;
            })
    }

    getFeature(imdbId: string): Promise<OmdbFeature | null> {
        if (!this.database || !this.featureCollection) {
            return Promise.reject('database was null');
        }
        return this.featureCollection.findOne({ imdbId });
    }

    // Episodes

    storeFeatureEpisode(episode: OmdbEpisode): Promise<boolean> {
        if (!this.featureEpisodeCollection) {
            return Promise.reject();
        }

        return this.featureEpisodeCollection.updateOne({
            seriesId: episode.seriesId,
            episode: episode.episode,
            season: episode.season,
        }, { $set: episode }, {
            upsert: true
        })
            .then(res => {
                return res.upsertedCount === 1 || res.modifiedCount === 1;
            });
    }

    getFeatureEpisode(seriesId: string, season: string, episode: string): Promise<OmdbEpisode | null> {
        if (!this.database || !this.featureEpisodeCollection) {
            return Promise.reject('database was null');
        }
        return this.featureEpisodeCollection.findOne({
            seriesId,
            season,
            episode,
        });
    }

    // Watch History

    storeFeatureWatchHistory(input: FeatureWatchHistoryInput): Promise<boolean> {
        if (!this.watchHistoryCollection) {
            return Promise.reject('Database not ready');
        }

        return this.watchHistoryCollection.updateOne({
            imdbId: input.imdbId
        }, { $set: input }, {
            upsert: true
        })
            .then(res => {
                return res.upsertedCount === 1 || res.modifiedCount === 1;
            });
    }


    storeSeriesWatchHistory(input: SeriesWatchHistoryInput): Promise<boolean> {
        if (!this.watchHistoryCollection) {
            return Promise.reject('Database not ready');
        }

        return this.getFeatureEpisode(input.imdbId, input.series, input.episode)
            .then(episode => {
                if (!episode || !this.watchHistoryCollection) {
                    return Promise.reject();
                }

                return this.watchHistoryCollection.updateOne({
                    imdbId: input.imdbId,
                    series: input.series,
                    episode: input.episode,
                }, { $set: {
                        ...input,
                        episodeRuntime: episode.runtime,
                    } }, {
                    upsert: true
                })
                    .then(res => {
                        console.log('store series watch history, upserted', res.upsertedCount)
                        return res.upsertedCount === 1 || res.modifiedCount === 1;
                    });
            });
    }

    getLibraryWatchHistory(): Promise<Array<WatchHistory>> {

        return new Promise((resolve, reject) => {
            if (!this.database || !this.watchHistoryCollection) {
                return reject('database was null');
            }

            this.watchHistoryCollection.find({}, {
                sort: [['finishedWatchingAtDateTime', 'desc']]
            }).limit(20).toArray((err, res) => {
                if (err) {
                    return reject(err);
                }

                const unrefined = <Array<SeriesWatchHistory & MovieWatchHistory>> <unknown> res;

                resolve(unrefined.map(history => <any> ({
                    ...history,
                    __typename: history.episode ? 'SeriesWatchHistory' : 'MovieWatchHistory',
                })));
            });
        })
    }

    getSeriesWatchHistory(imdbId: string, series?: string, episode?: string): Promise<SeriesWatchHistory | null> {
        if (!this.database || !this.watchHistoryCollection) {
            return Promise.reject('database was null');
        }

        if (series && episode) {
            return <Promise<SeriesWatchHistory>> this.watchHistoryCollection.findOne({
                imdbId,
                series,
                episode
            })
        }

        // in ther case of movies there will be only one entry, but in the case of
        // series there will be an entry per episode, in which case we want to only
        // fetch the latest watched
        return this.watchHistoryCollection.findOne({
            imdbId,
        }, {
            sort: [['finishedWatchingAtDateTime', 'desc']]
        })

    }

    getFeatureWatchHistory(imdbId: string): Promise<MovieWatchHistory | null> {
        if (!this.database || !this.watchHistoryCollection) {
            return Promise.reject('database was null');
        }

        return this.watchHistoryCollection.findOne({
            imdbId,
        }, {
            sort: [['finishedWatchingAtDateTime', 'desc']]
        })

    }
}