import request from 'request';
import {APIParameters, FailableResponse, Feature, FeatureEpisode, FeatureSeason} from "../../../types/OMDB";
import {FeatureType, OmdbEpisode, OmdbFeature} from "../../../types/Schema";

const promisedRequest = <T>(url: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) {
                return reject(err);
            }

            try {
                const data = <T> JSON.parse(body);
                resolve(data);
            } catch {
                reject();
            }

        })
    })
};

const promisedOMDBRequest = <T extends FailableResponse>(url: string): Promise<T> => {
    return promisedRequest<T>(url)
        .then(data => {
            if (data.error || data.Response === 'False') {
                throw new Error(`Data returned an error: ${data.error}`);
            }
            return data;
        })
};

const objectToParameters = (obj: { [key: string]: any }): string => {
    const params = [];
    for (let key in obj) {
       if (obj.hasOwnProperty(key)) {
           params.push(`${key}=${obj[key]}`)
       }
    }

    return params.length ? `?${params.join('&')}` : '';
}

const buildOMDBUrl = (parameters: APIParameters): string => {
    const url = `http://www.omdbapi.com${objectToParameters({
        apikey: process.env.OMDB_API_KEY,
        ...parameters
    })}`;

    return url;
}

export const getFeature = async (imdbId: string): Promise<OmdbFeature> => {
    try {
        const url = buildOMDBUrl({
            i: imdbId
        });

        const res = await promisedOMDBRequest<Feature>(url);
        // omdb api provides keys in a uppercase format, we dont want this
        return {
            addedToLibrary: new Date().getTime(),
            title: res.Title,
            year: res.Year,
            rated: res.Rated,
            released: res.Released,
            runtime: res.Runtime,
            genre: res.Genre,
            director: res.Director,
            writer: res.Writer,
            actors: res.Actors,
            plot: res.Plot,
            language: res.Language,
            country: res.Country,
            awards: res.Awards,
            poster: res.Poster,
            ratings: res.Ratings,
            metascore: res.Metascore,
            imdbRating: res.imdbRating,
            imdbVotes: res.imdbVotes,
            imdbId: res.imdbID,
            // convert omdb featuretype to graphql featuretype
            type: <FeatureType>res.Type.toUpperCase(),
            totalSeasons: res.totalSeasons
        }
    } catch {
        throw new Error('Failed OMDB request')
    }
};

export const getEpisode = async (imdbId: string, season: string, episode: string): Promise<OmdbEpisode> => {
    try {
        console.log('trying to fetch episode');
        const url = buildOMDBUrl({
            i: imdbId,
            Season: season,
            Episode: episode,
        });
        console.log('\t fetching from url', url);
        try {
            const res = await promisedOMDBRequest<FeatureEpisode>(url);
            // convert this into the graphql format
            return {
                addedToLibrary: new Date().getTime(),
                title: res.Title,
                year: res.Year,
                rated: res.Rated,
                released: res.Released,
                runtime: res.Runtime,
                genre: res.Genre,
                director: res.Director,
                writer: res.Writer,
                actors: res.Actors,
                plot: res.Plot,
                language: res.Language,
                country: res.Country,
                awards: res.Awards,
                poster: res.Poster,
                ratings: res.Ratings,
                metascore: res.Metascore,
                imdbRating: res.imdbRating,
                imdbVotes: res.imdbVotes,
                imdbId: res.imdbID,
                // convert omdb featuretype to graphql featuretype
                type: <FeatureType>res.Type.toUpperCase(),
                seriesId: imdbId,
                season: res.Season,
                episode: res.Episode,
                incompleteData: false,
            }
        } catch {
            console.log('OMDB api failed to return episode data, use default data');
            return {
                seriesId: imdbId,
                season,
                episode,
                addedToLibrary: new Date().getTime(),
                title: `Episode ${episode}`,
                type: FeatureType.Episode,
                incompleteData: true,
            }
        }

    } catch {
        throw new Error('\tFailed OMDB request')
    }
};