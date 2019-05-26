export type APIParameters = {
    i?: string,
    apikey?: string,
    Season?: string | number,
    Episode?: string | number,
}

export enum FeatureType {
    MOVIE = 'movie',
    SERIES = 'series',
    EPISODE = 'episode'
}

export type Rating = {
    source: string,
    value: string,
}

export type FailableResponse = {
    error?: string,
    Response: "True" | "False"
}

export type Feature = FailableResponse & {
    Title: string,
    Year: string,
    Rated: string,
    Released: string,
    Runtime: string,
    Genre: string,
    Director: string,
    Writer: string,
    Actors: string,
    Plot: string,
    Language: string,
    Country: string,
    Awards: string,
    Poster: string,
    Ratings: Array<Rating>,
    Metascore: string,
    imdbRating: string,
    imdbVotes: string,
    imdbID: string,
    Type: FeatureType,
    totalSeasons: string,
}

export type FeatureEpisodeListItem = {
    Title: string,
    Released: string,
    Episode: string,
    imdbRating: string,
    imdbId: string,
}

export type FeatureSeason = FailableResponse & {
    Title: string,
    Season: string,
    totalSeasons: string,
    Episodes: Array<FeatureEpisodeListItem>,
}

export type FeatureEpisode = Feature & {
    seriesID: string,
    Season: string,
    Episode: string,
}