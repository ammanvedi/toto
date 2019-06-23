import {Mutation, MutationTrackSeriesWatchArgs} from "../../../../types/Schema";
import {FeatureDatabase} from "../../database/FeatureDatabase";
import {MediaIndex} from "../../../../types/MediaIndex";
import {watchHistoryQueryResolver} from "../query/WatchHistoryQueryResolver";
import {singleLibrarySeriesQueryResolver} from "../query/SingleLibrarySeriesQueryResolver";
import {singleSeasonQueryResolver} from "../query/SingleSeasonQueryResolver";

export const trackSeriesWatchMutationResolver = async (
    input: MutationTrackSeriesWatchArgs,
    database: FeatureDatabase,
    mediaIndex: MediaIndex,
): Promise<Mutation["trackSeriesWatch"]> => {

    console.log('tracking series watch', input);

    if (!input.watched) {
        return;
    }

    const res = await database.storeSeriesWatchHistory(input.watched);
    console.log('\tdid try to save series watch success', !!res);
    return {
        updatedHistory: await watchHistoryQueryResolver(database) || [],
        updatedSeries: await singleLibrarySeriesQueryResolver(input.watched.imdbId, database, mediaIndex),
        updatedSeason: await singleSeasonQueryResolver(input.watched.imdbId, input.watched.series, mediaIndex, database),
    }
};