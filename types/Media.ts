import {MediaType} from "./Metadata";

export type Genre = Array<string>;

export type Actors = Array<string>;

export type Language = Array<string>;

export type SeriesNumber = number;

export type EpisodeNumber = number;

export type SeriesEpisode = [SeriesNumber, EpisodeNumber];

export type Episode = {
    sourceFileId: string,
    episodeNumber?: SeriesEpisode,
}


export type SingleSeries = Array<Episode>;

export type SeriesSources = {
    series: Array<SingleSeries>,
    unclassifiedEpisodes: SingleSeries,
};

export type PlayableMediaMetadata = {
    title: string,
    year: string,
    rating: string,
    released: string,
    genre: Genre,
    director: string,
    writer: string,
    actors: Actors,
    plot: string,
    language: Language,
    country: string,
    poster: string,
    imdbRating: string,
}

export type MovieMedia = PlayableMediaMetadata & {
    type: MediaType.MOVIE,
    sourceId: string
}

export type SeriesMedia = PlayableMediaMetadata & {
    type: MediaType.SERIES,
    source: SeriesSources
}