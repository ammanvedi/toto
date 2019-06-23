import {
    Mutation,
    MutationTrackFeatureWatchArgs
} from "../../../../types/Schema";
import {FeatureDatabase} from "../../database/FeatureDatabase";
import {watchHistoryQueryResolver} from "../query/WatchHistoryQueryResolver";
import {singleLibraryFeatureQueryResolver} from "../query/SingleLibraryFeatureQueryResolver";
import {MediaIndex} from "../../../../types/MediaIndex";

export const trackFeatureWatchMutationResolver = async (
    input: MutationTrackFeatureWatchArgs,
    database: FeatureDatabase,
    mediaIndex: MediaIndex,
): Promise<Mutation["trackFeatureWatch"]> => {

    if (!input.watched) {
        return;
    }

    const res = await database.storeFeatureWatchHistory(input.watched);
    console.log('\tdid try to save feature watch success', !!res);
    return {
        updatedHistory: await watchHistoryQueryResolver(database),
        updatedFeature: await singleLibraryFeatureQueryResolver(input.watched.imdbId, database, mediaIndex)
    }


};