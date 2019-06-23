export type Maybe<T> = T | null;
export type MaybePromise<T> = Promise<T> | T;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum FeatureType {
  Movie = "MOVIE",
  Series = "SERIES",
  Episode = "EPISODE"
}

export type FeatureWatchHistoryInput = {
  imdbId: Scalars["ID"];
  finishedWatchingAtDateTime: Scalars["Int"];
  finishedWatchingAtSeconds: Scalars["Int"];
};

export type FeatureWatchResponse = {
  __typename?: "FeatureWatchResponse";
  updatedHistory?: Maybe<Array<WatchHistory>>;
  updatedFeature?: Maybe<LibraryFeature>;
};

export type LibraryEpisode = OmdbEpisode &
  WithSource & {
    __typename?: "LibraryEpisode";
    watchHistory?: Maybe<SeriesWatchHistory>;
    title: Scalars["String"];
    year?: Maybe<Scalars["String"]>;
    rated?: Maybe<Scalars["String"]>;
    released?: Maybe<Scalars["String"]>;
    runtime?: Maybe<Scalars["String"]>;
    genre?: Maybe<Scalars["String"]>;
    director?: Maybe<Scalars["String"]>;
    writer?: Maybe<Scalars["String"]>;
    actors?: Maybe<Scalars["String"]>;
    plot?: Maybe<Scalars["String"]>;
    language?: Maybe<Scalars["String"]>;
    country?: Maybe<Scalars["String"]>;
    awards?: Maybe<Scalars["String"]>;
    poster?: Maybe<Scalars["String"]>;
    ratings?: Maybe<Array<Rating>>;
    metascore?: Maybe<Scalars["String"]>;
    imdbRating?: Maybe<Scalars["String"]>;
    imdbVotes?: Maybe<Scalars["String"]>;
    imdbId?: Maybe<Scalars["ID"]>;
    type: FeatureType;
    addedToLibrary: Scalars["Int"];
    seriesId: Scalars["ID"];
    season: Scalars["String"];
    episode: Scalars["String"];
    incompleteData: Scalars["Boolean"];
    sourceId?: Maybe<Scalars["String"]>;
  };

export type LibraryFeature = OmdbFeature &
  WithSource & {
    __typename?: "LibraryFeature";
    watchHistory?: Maybe<MovieWatchHistory>;
    sourceId: Scalars["String"];
    title: Scalars["String"];
    year: Scalars["String"];
    rated: Scalars["String"];
    released: Scalars["String"];
    runtime: Scalars["String"];
    genre: Scalars["String"];
    director: Scalars["String"];
    writer: Scalars["String"];
    actors: Scalars["String"];
    plot: Scalars["String"];
    language: Scalars["String"];
    country: Scalars["String"];
    awards: Scalars["String"];
    poster: Scalars["String"];
    ratings?: Maybe<Array<Rating>>;
    metascore: Scalars["String"];
    imdbRating: Scalars["String"];
    imdbVotes: Scalars["String"];
    imdbId: Scalars["ID"];
    type: FeatureType;
    totalSeasons: Scalars["String"];
    addedToLibrary: Scalars["Int"];
  };

export type LibrarySeason = {
  __typename?: "LibrarySeason";
  feature: LibrarySeries;
  episodes: Array<LibraryEpisode>;
};

export type LibrarySeries = OmdbFeature & {
  __typename?: "LibrarySeries";
  watchHistory?: Maybe<SeriesWatchHistory>;
  availableSeasons: Array<Scalars["Int"]>;
  title: Scalars["String"];
  year: Scalars["String"];
  rated: Scalars["String"];
  released: Scalars["String"];
  runtime: Scalars["String"];
  genre: Scalars["String"];
  director: Scalars["String"];
  writer: Scalars["String"];
  actors: Scalars["String"];
  plot: Scalars["String"];
  language: Scalars["String"];
  country: Scalars["String"];
  awards: Scalars["String"];
  poster: Scalars["String"];
  ratings?: Maybe<Array<Rating>>;
  metascore: Scalars["String"];
  imdbRating: Scalars["String"];
  imdbVotes: Scalars["String"];
  imdbId: Scalars["ID"];
  type: FeatureType;
  totalSeasons: Scalars["String"];
  addedToLibrary: Scalars["Int"];
};

export type MovieWatchHistory = WithHistoryMetrics & {
  __typename?: "MovieWatchHistory";
  imdbId: Scalars["ID"];
  finishedWatchingAtDateTime: Scalars["Int"];
  finishedWatchingAtSeconds: Scalars["Int"];
};

export type Mutation = {
  __typename?: "Mutation";
  trackFeatureWatch?: Maybe<FeatureWatchResponse>;
  trackSeriesWatch?: Maybe<SeriesWatchResponse>;
};

export type MutationTrackFeatureWatchArgs = {
  watched?: Maybe<FeatureWatchHistoryInput>;
};

export type MutationTrackSeriesWatchArgs = {
  watched?: Maybe<SeriesWatchHistoryInput>;
};

export type OmdbEpisode = {
  title: Scalars["String"];
  year?: Maybe<Scalars["String"]>;
  rated?: Maybe<Scalars["String"]>;
  released?: Maybe<Scalars["String"]>;
  runtime?: Maybe<Scalars["String"]>;
  genre?: Maybe<Scalars["String"]>;
  director?: Maybe<Scalars["String"]>;
  writer?: Maybe<Scalars["String"]>;
  actors?: Maybe<Scalars["String"]>;
  plot?: Maybe<Scalars["String"]>;
  language?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  awards?: Maybe<Scalars["String"]>;
  poster?: Maybe<Scalars["String"]>;
  ratings?: Maybe<Array<Rating>>;
  metascore?: Maybe<Scalars["String"]>;
  imdbRating?: Maybe<Scalars["String"]>;
  imdbVotes?: Maybe<Scalars["String"]>;
  imdbId?: Maybe<Scalars["ID"]>;
  type: FeatureType;
  addedToLibrary: Scalars["Int"];
  seriesId: Scalars["ID"];
  season: Scalars["String"];
  episode: Scalars["String"];
  incompleteData: Scalars["Boolean"];
};

export type OmdbFeature = {
  title: Scalars["String"];
  year: Scalars["String"];
  rated: Scalars["String"];
  released: Scalars["String"];
  runtime: Scalars["String"];
  genre: Scalars["String"];
  director: Scalars["String"];
  writer: Scalars["String"];
  actors: Scalars["String"];
  plot: Scalars["String"];
  language: Scalars["String"];
  country: Scalars["String"];
  awards: Scalars["String"];
  poster: Scalars["String"];
  ratings?: Maybe<Array<Rating>>;
  metascore: Scalars["String"];
  imdbRating: Scalars["String"];
  imdbVotes: Scalars["String"];
  imdbId: Scalars["ID"];
  type: FeatureType;
  totalSeasons: Scalars["String"];
  addedToLibrary: Scalars["Int"];
};

export type Query = {
  __typename?: "Query";
  allLibrarySeries?: Maybe<Array<LibrarySeries>>;
  singleLibrarySeries?: Maybe<LibrarySeries>;
  allLibraryFeatures?: Maybe<Array<LibraryFeature>>;
  singleLibraryFeature?: Maybe<LibraryFeature>;
  singleSeason?: Maybe<LibrarySeason>;
  watchHistory?: Maybe<Array<WatchHistory>>;
};

export type QuerySingleLibrarySeriesArgs = {
  imdbId: Scalars["ID"];
};

export type QuerySingleLibraryFeatureArgs = {
  imdbId: Scalars["ID"];
};

export type QuerySingleSeasonArgs = {
  seriesId: Scalars["ID"];
  season: Scalars["String"];
};

export type Rating = {
  __typename?: "Rating";
  source: Scalars["String"];
  value: Scalars["String"];
};

export type SeriesWatchHistory = WithHistoryMetrics & {
  __typename?: "SeriesWatchHistory";
  imdbId: Scalars["ID"];
  finishedWatchingAtDateTime: Scalars["Int"];
  finishedWatchingAtSeconds: Scalars["Int"];
  episode: Scalars["String"];
  series: Scalars["String"];
  episodeRuntime?: Maybe<Scalars["String"]>;
};

export type SeriesWatchHistoryInput = {
  imdbId: Scalars["ID"];
  finishedWatchingAtDateTime: Scalars["Int"];
  finishedWatchingAtSeconds: Scalars["Int"];
  episode: Scalars["String"];
  series: Scalars["String"];
};

export type SeriesWatchResponse = {
  __typename?: "SeriesWatchResponse";
  updatedHistory?: Maybe<Array<WatchHistory>>;
  updatedSeries?: Maybe<LibrarySeries>;
  updatedSeason?: Maybe<LibrarySeason>;
};

export type WatchHistory = SeriesWatchHistory | MovieWatchHistory;

export type WithAvailableSeasons = {
  availableSeasons?: Maybe<Array<Scalars["Int"]>>;
};

export type WithDateAdded = {
  addedToLibrary: Scalars["Int"];
};

export type WithHistoryMetrics = {
  imdbId: Scalars["ID"];
  finishedWatchingAtDateTime: Scalars["Int"];
  finishedWatchingAtSeconds: Scalars["Int"];
};

export type WithSource = {
  sourceId?: Maybe<Scalars["String"]>;
};
