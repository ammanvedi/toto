import {Feature, FeatureEpisode, FeatureType} from "./OMDB";

export type DatabaseExtras = {
    addedToLibrary: number,
}

export type DatabaseFeature = Feature & DatabaseExtras;

export type DatabaseFeatureEpisode = FeatureEpisode & DatabaseExtras;

export type HistoryMetrics = {
    imdbId: string,
    finishedWatchingAtDateTime: number,
    finishedWatchingAtSeconds: number,
}

export type SeriesWatchHistory = HistoryMetrics & {
    type: FeatureType.SERIES,
    episode: string,
    series: string,
}

export type MovieWatchHistory = HistoryMetrics & {
    type: FeatureType.MOVIE,
}

export type LibraryWatchHistory = SeriesWatchHistory | MovieWatchHistory;