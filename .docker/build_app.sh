#!/bin/bash
set -e

cp -R /clone /source
cd /source && npm install --production
rm -rf /clone

meteor build --architecture=os.linux.x86_64 --directory /app --server=http://localhost:3000
rm -rf ~/.meteor
rm /usr/local/bin/meteor
rm -rf /source

cd /app/bundle/programs/server/ && npm install
