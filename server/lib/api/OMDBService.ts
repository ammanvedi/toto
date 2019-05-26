import request from 'request';
import {APIParameters, FailableResponse, Feature, FeatureEpisode, FeatureSeason} from "../../../types/OMDB";

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

export const getFeature = async (imdbId: string): Promise<Feature> => {
    try {
        const url = buildOMDBUrl({
            i: imdbId
        });
        return await promisedOMDBRequest<Feature>(url);
    } catch {
        throw new Error('Failed OMDB request')
    }
};

export const getSeason = async (imdbId: string, season: number): Promise<FeatureSeason> => {
    try {
        const url = buildOMDBUrl({
            i: imdbId,
            Season: season
        });
        return await promisedOMDBRequest<FeatureSeason>(url);
    } catch {
        throw new Error('Failed OMDB request')
    }
};

export const getEpisode = async (imdbId: string, season: string, episode: string): Promise<FeatureEpisode> => {
    try {
        const url = buildOMDBUrl({
            i: imdbId,
            Season: season,
            Episode: episode,
        });
        return await promisedOMDBRequest<FeatureEpisode>(url);
    } catch {
        throw new Error('Failed OMDB request')
    }
};