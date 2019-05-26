#!/bin/bash

export $(xargs <.env)
cd ./dist/client
kill -9 $(lsof -t -i:${TOTO_CLIENT_PORT})
python -m SimpleHTTPServer ${TOTO_CLIENT_PORT}