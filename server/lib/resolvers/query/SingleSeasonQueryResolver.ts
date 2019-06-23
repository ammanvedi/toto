import {LibraryEpisode, Query} from "../../../../types/Schema";
import {MediaIndex} from "../../../../types/MediaIndex";
import {FeatureDatabase} from "../../database/FeatureDatabase";
import {FeatureType} from "../../../../types/OMDB";
import {singleLibrarySeriesQueryResolver} from "./SingleLibrarySeriesQueryResolver";

export const singleSeasonQueryResolver = async (
    seriesId: string,
    season: string,
    mediaIndex: MediaIndex,
    database: FeatureDatabase
): Promise<Query["singleSeason"]> => {
    const episodes: Array<LibraryEpisode> = [];

    const [ seriesMeta ] = mediaIndex.series.filter(series => series.imdbId === seriesId);
    if (!seriesMeta) {
        throw new Error(`could not find series ${seriesId} in index`);
    }

    const seriesData = await singleLibrarySeriesQueryResolver(seriesId, database, mediaIndex);
    if (!seriesData) {
        throw new Error(`could not find series ${seriesId} in database`);
    }

    const [ seriesEpisodes ] = seriesMeta.source.series.filter(episodes => {
        return episodes[0] && episodes[0].episodeNumber ? episodes[0].episodeNumber[0].toString() === season : false;
    });
    if (!seriesEpisodes) {
        throw new Error(`could not find series number ${season} in metadata`);
    }

    for (let i = 0; i < seriesEpisodes.length; i++) {
        const episode = seriesEpisodes[i];
        try {
            if (!episode.episodeNumber) {
                continue;
            }
            const episodeData = await database.getFeatureEpisode(seriesId, season, episode.episodeNumber[1].toString());
            if (!episodeData) {
                continue;
            }
            const watchHistory = await database.getSeriesWatchHistory(seriesId, season, episode.episodeNumber[1].toString());
            console.log('single season resolver fetched history', watchHistory, seriesId, season, episode.episodeNumber);
            episodes.push({
                ...episodeData,
                sourceId: episode.sourceFileId,
                watchHistory
            })
        } catch {}
    }

    return {
        feature: seriesData,
        episodes
    }
}