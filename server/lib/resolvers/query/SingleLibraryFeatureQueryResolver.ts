import {Query} from "../../../../types/Schema";
import {FeatureDatabase} from "../../database/FeatureDatabase";
import {FeatureType} from "../../../../types/OMDB";
import {MediaIndex} from "../../../../types/MediaIndex";

export const singleLibraryFeatureQueryResolver = async (
    imdbId: string,
    database: FeatureDatabase,
    mediaIndex: MediaIndex,
): Promise<Query["singleLibraryFeature"]> => {
    console.log('resolving single feature', imdbId);

    const movieData = await database.getFeature(imdbId);
    console.log('\ttried to get feature data', !!movieData);
    if (movieData) {
        const history = await database.getFeatureWatchHistory(movieData.imdbId);
        // get video file info from media index
        const indexEntry = mediaIndex.movies.filter(item => item.imdbId === imdbId)[0];
        console.log('\ttried to get media index entry', !!indexEntry);
        if (!indexEntry) {
            return null;
        }

        return {
            ...movieData,
            sourceId: indexEntry.sourceId,
            watchHistory: history && history.type === FeatureType.MOVIE ? history : null
        }
    }

};