import {MovieMedia, SeriesMedia} from "./Media";

export type MediaIndex = {
    series: Array<SeriesMedia>,
    movies: Array<MovieMedia>,
    fileIndex: {
        [key: string]: string,
    }
}