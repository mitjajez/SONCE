#!/bin/bash
set -e

cp -R /clone /source
cd /source && npm install --production

meteor build --architecture=os.linux.x86_64 --directory /app --server=http://localhost:3000
cd /app/bundle/programs/server/ && npm install

ls -lh /app/bundle
