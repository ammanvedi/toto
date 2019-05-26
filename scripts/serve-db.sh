#!/bin/bash

brew install mongodb
mkdir -p ~/data/db
kill -9 $(lsof -t -i:3007)
mongod --dbpath ~/data/db --port 3007