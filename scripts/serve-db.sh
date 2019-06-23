#!/bin/bash

export $(xargs <.env)
brew install mongodb
mkdir -p ~/data/db
kill -9 $(lsof -t -i:${TOTO_DB_PORT})
mongod --dbpath ${TOTO_DATA_PATH} --port ${TOTO_DB_PORT}