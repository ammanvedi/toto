import {Feature, FeatureEpisode} from "./OMDB";
import {DatabaseFeature, LibraryWatchHistory, MovieWatchHistory, SeriesWatchHistory} from "./Database";

export type APIExtras = {
    sourceId: string,
}

export type LibraryFeature = DatabaseFeature & APIExtras & {
    __typename: 'LibraryFeature',
    watchHistory: MovieWatchHistory | null
};

export type LibrarySeries = DatabaseFeature & {
    __typename: 'LibrarySeries',
    availableSeasons: Array<number>,
    watchHistory: SeriesWatchHistory | null
}

export type LibraryEpisode = FeatureEpisode & APIExtras & {
    watchHistory: SeriesWatchHistory | null
};

export type FeatureSeasonResponse = {
    feature: DatabaseFeature,
    episodes: Array<LibraryEpisode>,
}

export type LibraryResponse = {
    series: Array<LibrarySeries>,
    movies: Array<LibraryFeature>,
}

export type LibraryWatchHistoryResponse = LibraryWatchHistory;