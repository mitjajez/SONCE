#!/bin/bash
set -e

curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh
meteor --version

cp -R /clone /source
cd /source && npm install --production

meteor build --architecture=os.linux.x86_64 --directory /app --server=http://localhost:3000
cd /app/bundle/programs/server/ && npm install

ls -lh /app/bundle

# cleanup
rm -rf /clone
rm -rf ~/.meteor
rm /usr/local/bin/meteor
rm -rf /source
