import {Query} from "../../../../types/Schema";
import {MediaIndex} from "../../../../types/MediaIndex";
import {FeatureDatabase} from "../../database/FeatureDatabase";
import {singleLibraryFeatureQueryResolver} from "./SingleLibraryFeatureQueryResolver";

export const allLibraryFeatureQueryResolver = async (
    mediaIndex: MediaIndex,
    database: FeatureDatabase
): Promise<Query["allLibraryFeatures"]> => {
    const moviesList: Query["allLibraryFeatures"] = [];

    const movies = mediaIndex.movies;

    for(let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        const feature = await singleLibraryFeatureQueryResolver(
            movie.imdbId,
            database,
            mediaIndex,
        );

        if (feature) {
            moviesList.push(feature);
        }
    }

    return moviesList;
};

