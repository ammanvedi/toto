import {PlayableMediaMetadata} from "../../types/Media";
import request from 'request';

type GenericObject = {
    [key: string]: any
}

const OMDBCache: {[key: string]: PlayableMediaMetadata} = {};

const objectKeysToLowerCase = (obj: GenericObject): GenericObject => {

    return Object.keys(obj).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = obj[key];
        return newObj;
    }, <GenericObject> {})
};

export const getOMDBDataForShow = (showId: string): Promise<PlayableMediaMetadata> => {

    if (OMDBCache[showId]) {
        return Promise.resolve(OMDBCache[showId]);
    }

    return new Promise((resolve, reject) => {
        request(`http://www.omdbapi.com/?i=${showId}&apikey=${process.env.OMDB_API_KEY}`, (error, response, body) => {
            if (error) {
                return reject();
            }

            try {
                const jsonResponse = JSON.parse(body);
                const meta = <PlayableMediaMetadata> objectKeysToLowerCase(jsonResponse);
                OMDBCache[showId] = meta;
                resolve(meta);
            } catch {
                reject()
            }

        })
    })
};