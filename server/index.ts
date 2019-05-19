import express from 'express';
import {createMediaIndex} from "./lib/MediaIndex";
import {MediaIndex} from "../types/MediaIndex";
import {statSync, createReadStream} from 'fs';

require('dotenv').config();

const port = process.env.TOTO_PORT;
const roots = process.env.TOTO_ROOTS;
const formats = process.env.TOTO_FORMATS;

const app = express();

let mediaIndex: MediaIndex;

app.get('/library', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify(mediaIndex));
    res.status(200).end();
});

app.get('/video/:sourceId', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const file = mediaIndex.fileIndex[req.params.sourceId];
    if (file) {
        console.log('received request to serve file', file);
        const { size } = statSync(file);
        const { headers: { range } } = req;

        if (range) {
            const parts = range.replace(/bytes=/, "").split('-');
            const start = parseInt(parts[0]);
            const end = parts[1] ? parseInt(parts[1]) : size - 1;
            const chunkSize = (end - start) + 1;
            const fileStream = createReadStream(file, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            fileStream.pipe(res);

        }
    } else {
        res.status(404).end();
    }
});

app.get('/rebuild-index', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        if (roots && formats) {
            mediaIndex = await createMediaIndex(roots.split(','), formats.split(','));
            res.status(200).end();
        } else {
            console.log('TOTO_ROOTS or TOTO_FORMATS envars are missing')
        }
    } catch {
        res.status(500).end();
    }
});

if (roots && formats) {
    console.log('creating media index...');
    createMediaIndex(roots.split(','), formats.split(','))
        .then(index => {
            console.log('created media index');
            mediaIndex = index;
            app.listen(port, () => {
                console.log('started serving on port', port);
            });
        })
} else {
    console.log('TOTO_ROOTS or TOTO_FORMATS envars are missing')
}




