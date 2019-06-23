import {Query} from "../../../../types/Schema";
import {FeatureDatabase} from "../../database/FeatureDatabase";
import {MediaIndex} from "../../../../types/MediaIndex";
import {getAvailableSeries} from "../../media-index/EvaluateMediaIndex";
import {FeatureType} from "../../../../types/OMDB";

export const singleLibrarySeriesQueryResolver = async (
    imdbId: string,
    database: FeatureDatabase,
    mediaIndex: MediaIndex,
): Promise<Query["singleLibrarySeries"]> => {
    console.log('single series query resolver');
    const seriesData = await database.getFeature(imdbId);
    console.log('series data:', !!seriesData, imdbId);
    if (seriesData) {
        const history = await database.getSeriesWatchHistory(seriesData.imdbId);
        // get video file info from media index
        const indexEntry = mediaIndex.series.filter(item => item.imdbId === imdbId)[0];
        console.log('indexEntry', indexEntry);
        if (!indexEntry) {
            return null;
        }
        return {
            ...seriesData,
            availableSeasons: getAvailableSeries(indexEntry.source),
            watchHistory: history && history.type === FeatureType.SERIES ? history : null
        }
    }
};