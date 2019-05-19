import {MediaIndex} from "../../types/MediaIndex";
import {MediaType, Metadata} from "../../types/Metadata";
import {readdirSync, readFileSync, statSync} from 'fs';
import {extname, join} from 'path';
import klawSync from 'klaw-sync';
import {getOMDBDataForShow} from "./OMDBService";
import {Episode, MovieMedia, PlayableMediaMetadata, SeriesEpisode, SeriesMedia, SeriesSources} from "../../types/Media";
import sha1 from 'sha1';

const getAllFilesOfTypeFromDirectory = (directory: string, fileTypes: Array<string>): Array<string> => {
    return klawSync(directory, {
        nodir: true,
    })
    .map(item => item.path)
    .filter(filePath => fileTypes.indexOf(extname(filePath)) > -1)
};

const getEpisodeNumber = (fileName: string): SeriesEpisode | false => {
    const result = /S([0-9]{2})E([0-9]{2})/.exec(fileName);

    if (result) {
        const seriesNo = parseInt(result[1]);
        const episodeNo = parseInt(result[2]);
        if (typeof seriesNo === 'number' && typeof episodeNo === 'number') {
            return [ seriesNo, episodeNo ];
        } else {
            return false;
        }
    }

    return false;
};

const sortSeries = (a: Episode, b: Episode): number => {
    if (a.episodeNumber == null || b.episodeNumber == null) {
        return 0;
    }
    return a.episodeNumber[1] - b.episodeNumber[1];
};

const organiseEpisodes = (files: Array<string>, index: { [key: string]: string } ): SeriesSources => {

    const sources: SeriesSources = {
        series: [],
        unclassifiedEpisodes: []
    };

    for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        const episodeNumber = getEpisodeNumber(fileName);

        if (episodeNumber) {
            const [series] = episodeNumber;

            if (!sources.series[series]) {
                sources.series[series] = [];
            }

            sources.series[series].push({
                sourceFileId: createSourceIdAndStoreInIndex(fileName, index),
                episodeNumber,
            })

        } else {
            sources.unclassifiedEpisodes.push({
                sourceFileId: createSourceIdAndStoreInIndex(fileName, index),
            })
        }
    }

    sources.series = sources.series.map(singleSeries => singleSeries.sort(sortSeries)).filter(singleSeries => singleSeries);

    return sources;
};

export const createSourceIdAndStoreInIndex = (filePath: string, index: { [key: string]: string }): string => {
    const hashed = sha1(filePath).toString();
    index[hashed] = filePath;
    return hashed;
};

export const createMediaIndex = async (rootFolders: Array<string>, fileTypes: Array<string>): Promise<MediaIndex> => {

    const mediaIndex: MediaIndex = {
        series: [],
        movies: [],
        fileIndex: {}
    };

    for(let i = 0; i < rootFolders.length; i++) {
        const root = rootFolders[i];
        console.log('looking into root', root);

        // look at direct children of the root
        const directoryContent = readdirSync(root);
        const childDirectories = directoryContent.filter(f => statSync(join(root, f)).isDirectory());
        for (let j = 0; j < childDirectories.length; j++) {
            const directory = childDirectories[j];
            const fullDirectoryPath = join(root, directory);

            console.log('checking sub directory', directory);

            if (directory === '.' || directory === '..') {
                continue;
            }

            // make sure this directory has metadata
            let metadata: Metadata | null = null;
            const metaPath = join(fullDirectoryPath, 'metadata.json');
            console.log('fetching metadata', metaPath);
            try {
                const fileData = readFileSync(metaPath);
                metadata = JSON.parse(fileData.toString());
                console.log('got metadata for show')
            } catch {
                // otherwise look at other directories
                console.log('could not find meta located at', metaPath);
                continue;
            }

            if (!metadata) {
                continue;
            }

            // get all the video files from this directory so we can build the sources index
            const videoFiles = getAllFilesOfTypeFromDirectory(fullDirectoryPath, fileTypes);
            console.log(`found ${videoFiles.length} video files`)
            // now fetch the metadata from the OMDB service
            let OMDBData: PlayableMediaMetadata | null;
            try {
                console.log('trying to fetch OMDB data...');
                OMDBData = await getOMDBDataForShow(metadata.imdb_id);
                console.log(`success fetching OMDB data for show ${OMDBData.title}`);
            } catch {
                console.log('failed fetching OMDB data, skipping...')
                continue;
            }

            // now create a media type object based on the type of show we are dealing with

            switch(metadata.type) {
                case MediaType.MOVIE:
                    if (videoFiles.length > 1) {
                        console.log(`Movie ${OMDBData.title} in directory ${directory} was found to have more than one movie source, taking first source`)
                    }
                    const movie: MovieMedia = {
                        ...OMDBData,
                        type: MediaType.MOVIE,
                        sourceId: createSourceIdAndStoreInIndex(videoFiles[0], mediaIndex.fileIndex),
                    };
                    mediaIndex.movies.push(movie);
                    break;
                case MediaType.SERIES:
                    const series: SeriesMedia = {
                        ...OMDBData,
                        type: MediaType.SERIES,
                        source: organiseEpisodes(videoFiles, mediaIndex.fileIndex)
                    };
                    mediaIndex.series.push(series);
                    break;
            }
        }
    }

    return mediaIndex;
};