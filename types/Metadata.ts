export enum MediaType {
    MOVIE = 'MOVIE',
    SERIES = 'SERIES',
}

export type Metadata = {
    imdb_id: string,
    type: MediaType
}
