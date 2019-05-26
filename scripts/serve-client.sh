#!/bin/bash

cd ./dist/client
kill -9 $(lsof -t -i:3009)
python -m SimpleHTTPServer 3009