import {MediaIndex} from "../../../types/MediaIndex";
import {FeatureDatabase} from "../database/FeatureDatabase";
import {getEpisode, getFeature} from "../api/OMDBService";
import {FeatureSeasonResponse, LibraryEpisode, LibraryResponse} from "../../../types/API";
import {SeriesSources} from "../../../types/Media";
import {FeatureType} from "../../../types/OMDB";

const storeFeature = async (imdbId: string, database: FeatureDatabase): Promise<void> => {
    console.log(`checking if we have metadata for ${imdbId} in database...`);
    try {
        const hasMovie = await database.getFeature(imdbId);
        if (hasMovie) {
            console.log(`we do have data for ${imdbId} aka ${hasMovie.Title}`);
            return Promise.resolve();
        }

        console.log(`we do not have data for ${imdbId}, fetching...`);
        const featureData = await getFeature(imdbId);
        await database.storeFeature(featureData);
        console.log(`we did fetch data for ${imdbId} aka ${featureData.Title}`);
    } catch (err) {
        throw new Error(err.toString());
    }
};

const storeFeatureEpisode = async (
    seriesId: string,
    season: string,
    episode: string,
    database: FeatureDatabase
): Promise<void> => {

    try {
        const hasEpisode = await database.getFeatureEpisode(seriesId, season, episode);

        if (hasEpisode) {
            return Promise.resolve();
        }

        const episodeData = await getEpisode(seriesId, season, episode);
        await database.storeFeatureEpisode(episodeData);
    } catch (err) {
        throw new Error(err.toString());
    }
};

/**
 * This function will take the media index (the actual list of items that we have on the disk)
 * and resolve it with the data we have in mongoDB. if anything is missing from mongo then
 * it will be fetched from OMDB API and stored.
 *
 * When this functions promise returns we will have all media data required from OMDB
 */
export const evaluateMediaIndex = async (mediaIndex: MediaIndex, database: FeatureDatabase): Promise<void> => {
    const { movies, series } = mediaIndex;

    // first check all the movies
    for (let i = 0; i < movies.length; i++) {
        const { imdbId } = movies[i];
        try {
            await storeFeature(imdbId, database)
        } catch {}
    }

    // now we check the series
    for (let j = 0; j < series.length; j++) {
        const { imdbId, source } = series[j];
        try {
            await storeFeature(imdbId, database);

            // each series
            for (let s = 0; s < source.series.length; s++) {
                const seriesData = source.series[s];
                // each episode
                for (let e = 0; e < seriesData.length; e++) {
                    const episode = seriesData[e];
                    if (episode.episodeNumber) {
                        await storeFeatureEpisode(
                            imdbId,
                            episode.episodeNumber[0].toString(),
                            episode.episodeNumber[1].toString(),
                            database
                        );
                    }
                }
            }

        } catch {}
    }
};

export const getSeasonResponseFromMediaIndex = async (
    seriesId: string,
    season: string,
    mediaIndex: MediaIndex,
    database: FeatureDatabase
): Promise<FeatureSeasonResponse> => {

    const episodes: Array<LibraryEpisode> = [];

    const [ seriesMeta ] = mediaIndex.series.filter(series => series.imdbId === seriesId);
    if (!seriesMeta) {
        throw new Error(`could not find series ${seriesId} in index`);
    }

    const seriesData = await database.getFeature(seriesId);
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
            const watchHistory = await database.getFeatureWatchHistory(seriesId, season, episode.episodeNumber[1].toString());
            episodes.push({
                ...episodeData,
                sourceId: episode.sourceFileId,
                watchHistory: watchHistory && watchHistory.type === FeatureType.SERIES ? watchHistory : null
            })
        } catch {}
    }

    return {
        feature: seriesData,
        episodes
    }
};

export const getLibraryresponseFromMediaIndex = async (mediaIndex: MediaIndex, database: FeatureDatabase): Promise<LibraryResponse> => {
    const response: LibraryResponse = {
        movies: [],
        series: [],
    };

    const { movies, series } = mediaIndex;

    for(let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const movieData = await database.getFeature(movie.imdbId);
        if (movieData) {
            const history = await database.getFeatureWatchHistory(movieData.imdbID);
            response.movies.push({
                __typename: 'LibraryFeature',
                ...movieData,
                sourceId: movie.sourceId,
                watchHistory: history && history.type === FeatureType.MOVIE ? history : null
            });
        }

    }

    for(let j = 0; j < series.length; j++) {
        const seriesFeature = series[j];
        const seriesData = await database.getFeature(seriesFeature.imdbId);
        if (seriesData) {
            const history = await database.getFeatureWatchHistory(seriesData.imdbID);
            response.series.push({
                __typename: 'LibrarySeries',
                ...seriesData,
                availableSeasons: getAvailableSeries(seriesFeature.source),
                watchHistory: history && history.type === FeatureType.SERIES ? history : null
            });
        }
    }

    return response;
};

const getAvailableSeries = (sources: SeriesSources): Array<number> => {
    const available = [];
    for(let i = 0; i < sources.series.length; i++) {
        const series = sources.series[i];
        if (series.length && series[0].episodeNumber) {
            available.push(series[0].episodeNumber[0]);
        }
    }

    return available;
}