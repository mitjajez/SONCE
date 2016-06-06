#!/bin/bash
set -e

# Set a delay to wait to start meteor container
if [[ $DELAY ]]; then
  echo "Delaying startup for $DELAY seconds"
  sleep $DELAY
fi

# needs a mongoinstance - defaults to container linking with alias 'db'
export MONGO_URL=mongodb://db:27017/meteor \
    HOME=/tmp \
    PORT=3000 \
    ROOT_URL=http://localhost:3000 \
    Accounts_AvatarStorePath=/app/uploads

cd /app
echo "=> Starting meteor app on port:$PORT"
node bundle/main.js
