#!/bin/bash -e

NAME="sonce"
VERSION="dev" #latest
DOCKER_TAG="mitjajez/${NAME}"
DOMAIN="localhost" # .se as shematic editor / .be may be as board editor
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

docker stop "${NAME}" || true
sleep 1
docker rm "${NAME}" || true
sleep 1

docker pull ${DOCKER_TAG}:${VERSION}
docker run -d \
 --name "${NAME}" --hostname "${NAME}" \
 --env ROOT_URL=${SERVER} \
 --env PORT=3000 \
 --publish="3000:3000" \
 --link sonce_mongodb:db \
 ${DOCKER_TAG}:${VERSION}
