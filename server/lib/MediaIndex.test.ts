import {createMediaIndex} from "./MediaIndex";
import {join} from 'path';

require('dotenv').config();

describe('createMediaIndex', () => {

    it ('returns correctly', async () => {
        const base = join(__dirname, '..', 'mock-data', 'directory-structure');
        const roots = [
            join(base, 'movies'),
            join(base, 'tv'),
        ];
        const extensions = ['.mkv', '.avi', '.mov', '.mp4'];
        const result = await createMediaIndex(roots, extensions);

        expect(result.series.length).toBe(1);
        expect(result.movies.length).toBe(1);

        expect(result.series[0].type).toBe('SERIES');
        expect(result.series[0].source.series.length).toBe(2);

        expect(result.movies[0].type).toBe('MOVIE');
    })

});