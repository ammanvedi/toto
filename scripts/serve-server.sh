#!/bin/bash

kill -9 $(lsof -t -i:3007)
export TOTO_PORT=3008
node dist/server/index.js