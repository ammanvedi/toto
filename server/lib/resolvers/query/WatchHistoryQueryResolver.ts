import {Query} from "../../../../types/Schema";
import {FeatureDatabase} from "../../database/FeatureDatabase";

export const watchHistoryQueryResolver = async (
    database: FeatureDatabase
): Promise<Query["watchHistory"]> => {
    const history = await database.getLibraryWatchHistory();
    console.log('watch history', history);
    return history;
};