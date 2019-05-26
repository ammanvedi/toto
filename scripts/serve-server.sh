#!/bin/bash

export $(xargs <.env)
kill -9 $(lsof -t -i:${TOTO_SERVER_PORT})
node dist/server/index.js