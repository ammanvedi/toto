import {Query} from "../../../../types/Schema";
import {MediaIndex} from "../../../../types/MediaIndex";
import {FeatureDatabase} from "../../database/FeatureDatabase";
import {singleLibrarySeriesQueryResolver} from "./SingleLibrarySeriesQueryResolver";

export const allLibrarySeriesQueryResolver = async (
    mediaIndex: MediaIndex,
    database: FeatureDatabase,
): Promise<Query["allLibrarySeries"]> => {
    const seriesList: Query["allLibrarySeries"] = [];
    const series = mediaIndex.series;
    for(let j = 0; j < series.length; j++) {
        const seriesFeature = series[j];
        const seriesData = await singleLibrarySeriesQueryResolver(
            seriesFeature.imdbId,
            database,
            mediaIndex,
        );
        if (seriesData) {
            seriesList.push(seriesData);
        }
    }

    return seriesList;
};