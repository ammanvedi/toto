import {Collection, Db, MongoClient} from "mongodb";
import {Feature, FeatureEpisode, FeatureType} from "../../../types/OMDB";
import {
    DatabaseFeature,
    DatabaseFeatureEpisode,
    LibraryWatchHistory,
    MovieWatchHistory,
    SeriesWatchHistory
} from "../../../types/Database";

export class FeatureDatabase {

    private connected: boolean = false;
    private client: MongoClient | null = null;
    private database: Db | null = null;
    private featureCollection: Collection<DatabaseFeature> | null = null;
    private featureEpisodeCollection: Collection<DatabaseFeatureEpisode> | null = null;
    private watchHistoryCollection: Collection<LibraryWatchHistory> | null = null;

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

    storeFeature(feature: Feature): Promise<boolean> {
        if (!this.featureCollection) {
            return Promise.reject();
        }
        return this.featureCollection.insertOne({
            ...feature,
            addedToLibrary: new Date().getTime(),
        })
            .then(result => {
                return result.insertedCount === 1;
            })
    }

    storeFeatureEpisode(episode: FeatureEpisode): Promise<boolean> {
        if (!this.featureEpisodeCollection) {
            return Promise.reject();
        }
        return this.featureEpisodeCollection.insertOne({
            ...episode,
            addedToLibrary: new Date().getTime(),
        })
            .then(result => {
                return result.insertedCount === 1;
            })
    }

    getFeature(imdbID: string): Promise<DatabaseFeature | null> {
        if (!this.database || !this.featureCollection) {
            return Promise.reject('database was null');
        }
        return this.featureCollection.findOne({ imdbID });
    }

    getFeatureEpisode(seriesID: string, season: string, episode: string): Promise<DatabaseFeatureEpisode | null> {
        if (!this.database || !this.featureEpisodeCollection) {
            return Promise.reject('database was null');
        }
        return this.featureEpisodeCollection.findOne({
            seriesID,
            Season: season,
            Episode: episode,
        });
    }

    getLibraryWatchHistory(): Promise<Array<LibraryWatchHistory>> {

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

                resolve(res);
            });
        })
    }

    getFeatureWatchHistory(imdbId: string, series?: string, episode?: string): Promise<LibraryWatchHistory | null> {

        if (!this.database || !this.watchHistoryCollection) {
            return Promise.reject('database was null');
        }

        if (series && episode) {
            return this.watchHistoryCollection.findOne({
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

    storeLibraryWatchHistoryEntry(historyItem: LibraryWatchHistory): Promise<boolean> {
        if (!this.watchHistoryCollection) {
            return Promise.reject();
        }

        switch (historyItem.type) {
            case FeatureType.MOVIE:
                return this.watchHistoryCollection.updateOne({
                    imdbId: historyItem.imdbId
                }, { $set: historyItem }, {
                    upsert: true
                })
                    .then(res => {
                        return res.upsertedCount === 1;
                    });
                break;
            case FeatureType.SERIES:
                return this.getFeatureEpisode(historyItem.imdbId, historyItem.series, historyItem.episode)
                    .then(episode => {
                        if (!episode || !this.watchHistoryCollection) {
                            return Promise.reject();
                        }

                        return this.watchHistoryCollection.updateOne({
                            imdbId: historyItem.imdbId,
                            series: historyItem.series,
                            episode: historyItem.episode,
                        }, { $set: {
                                ...historyItem,
                                episodeRuntime: episode.Runtime,
                            } }, {
                            upsert: true
                        })
                            .then(res => {
                                return res.upsertedCount === 1;
                            });
                    });
                break;
        }

        return Promise.reject();
    }
}