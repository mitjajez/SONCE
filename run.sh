#!/bin/bash -e

# WARNING: You have to adapt the script for your installation. It contains hard-coded values for another installation.

# An example script to run the app in production. It uses data volumes under the $DATA_ROOT directory.
# By default /srv. It uses a MongoDB database, tozd/meteor-mongodb image which is automatically run as well.
# Moreover, the example uses tozd/docker-hosts for service discovery. Feel free to use Docker container linking instead.

NAME="sonce"
VERSION="latest"
CURRENT_DIR=`basename $PWD`
DOCKER_TAG="mitjajez/sonce"
DOMAIN="sonce.se" # .se as shematic editor / .be may be as board editor
SERVER="http://${DOMAIN}"

DATA_ROOT='/srv'
MONGODB_DATA="${DATA_ROOT}/${NAME}/mongodb/data"
MONGODB_LOG="${DATA_ROOT}/${NAME}/mongodb/log"


docker stop "${NAME}_mongodb" || true
sleep 1
docker rm "${NAME}_mongodb" || true
sleep 1

docker run -d \
  --name "${NAME}_mongodb" --hostname "${NAME}_mongodb" \
  --volume "${MONGODB_DATA}:/data/db" \
  mongo

docker ps -s

docker stop "${NAME}" || true
sleep 1
docker rm "${NAME}" || true
sleep 1

docker run -it \
 --name "${NAME}" --hostname "${NAME}" \
 --env ROOT_URL=${SERVER} --env VIRTUAL_HOST=${DOMAIN} --env VIRTUAL_URL=/ \
 --link sonce_mongodb:db \
 --publish="80:3000" \
 --env VIRTUAL_LETSENCRYPT=true \
 --env DELAY=10 \
 ${DOCKER_TAG}

 docker pause ${DOCKER_TAG}

docker ps -s
