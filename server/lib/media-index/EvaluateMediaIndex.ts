import {MediaIndex} from "../../../types/MediaIndex";
import {FeatureDatabase} from "../database/FeatureDatabase";
import {getEpisode, getFeature} from "../api/OMDBService";
import {SeriesSources} from "../../../types/Media";

const storeFeature = async (imdbId: string, database: FeatureDatabase): Promise<void> => {
    console.log(`checking if we have metadata for ${imdbId} in database...`);
    try {
        const hasMovie = await database.getFeature(imdbId);
        if (hasMovie) {
            console.log(`we do have data for ${imdbId} aka ${hasMovie.title}`);
            return Promise.resolve();
        }

        console.log(`we do not have data for ${imdbId}, fetching...`);
        const featureData = await getFeature(imdbId);
        await database.storeFeature(featureData);
        console.log(`we did fetch data for ${imdbId} aka ${featureData.title}`);
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
    console.log('attempting to store episode')

    try {
        const hasEpisode = await database.getFeatureEpisode(seriesId, season, episode);
        console.log('\tchecked if had episode', !!hasEpisode, seriesId, season, episode);
        if (hasEpisode && !hasEpisode.incompleteData) {
            return Promise.resolve();
        }
        console.log('\twill fetch data for episode' );
        const episodeData = await getEpisode(seriesId, season, episode);
        console.log('\tdid try to fetch episode success:', !!episodeData);
        if (episodeData) {
            await database.storeFeatureEpisode(episodeData);
        }
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


export const getAvailableSeries = (sources: SeriesSources): Array<number> => {
    const available = [];
    for(let i = 0; i < sources.series.length; i++) {
        const series = sources.series[i];
        if (series.length && series[0].episodeNumber) {
            available.push(series[0].episodeNumber[0]);
        }
    }

    return available;
};