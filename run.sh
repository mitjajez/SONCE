#!/bin/bash -e

# WARNING: You have to adapt the script for your installation. It contains hard-coded values for another installation.

# An example script to run the app in production. It uses data volumes under the $DATA_ROOT directory.
# By default /srv. It uses a MongoDB database, tozd/meteor-mongodb image which is automatically run as well.
# Moreover, the example uses tozd/docker-hosts for service discovery. Feel free to use Docker container linking instead.

NAME="sonce"
VERSION="latest"
CURRENT_DIR=`basename $PWD`
BUILD_DIR="/home/mitja/Dokumenti/SONCE/docker-build"
DOCKER_TAG=mitjajez/sonce
DOMAIN="sonce.se" # .se as shematic editor / .be may be as board editor
SERVER="http://${DOMAIN}"

DATA_ROOT='/srv'
MONGODB_DATA="${DATA_ROOT}/${NAME}/mongodb/data"
MONGODB_LOG="${DATA_ROOT}/${NAME}/mongodb/log"

METEOR_LOG="${DATA_ROOT}/${NAME}/meteor/log"
METEOR_STORAGE="${DATA_ROOT}/${NAME}/meteor/storage"

# This file is used by both mitjajez/sonce and tozd/meteor-mongodb images. The
# latter automatically creates the database and accounts with provided
# passwords. The file should look like:
#
# MONGODB_ADMIN_PWD='<pass>'
# MONGODB_CREATE_PWD='<pass>'
# MONGODB_OPLOGGER_PWD='<pass>'
#
# export MONGO_URL="mongodb://meteor:${MONGODB_CREATE_PWD}@sonce_mongodb/meteor"
# export MONGO_OPLOG_URL="mongodb://oplogger:${MONGODB_OPLOGGER_PWD}@sonce_mongodb/local?authSource=admin"
CONFIG="${DATA_ROOT}/${NAME}/run.config"

mkdir -p "$MONGODB_DATA"
mkdir -p "$MONGODB_LOG"
mkdir -p "$METEOR_LOG"
mkdir -p "$METEOR_STORAGE"

touch "$CONFIG"

if [ ! -s "$CONFIG" ]; then
  echo "Set MONGODB_CREATE_PWD, MONGODB_ADMIN_PWD, MONGODB_OPLOGGER_PWD and export MONGO_URL, MONGO_OPLOG_URL environment variables in '$CONFIG'."
  exit 1
fi

docker stop "${NAME}_mongodb" || true
sleep 1
docker rm "${NAME}_mongodb" || true
sleep 1

docker run --detach=true --restart=always --name "${NAME}_mongodb" --hostname "${NAME}_mongodb" \
 --volume "${CONFIG}:/etc/service/mongod/run.config" \
 --volume "${MONGODB_LOG}:/var/log/mongod" --volume "${MONGODB_DATA}:/var/lib/mongodb" \
 tozd/meteor-mongodb:2.6

#docker run \
#  --name "${NAME}_mongodb" \
#  --volume "${MONGODB_DATA}:/data/db" \
#  --volume "${CONFIG}:/etc/service/meteor/run.config" \
#  -d mongo

docker ps -s

docker stop "${NAME}" || true
sleep 1
docker rm "${NAME}" || true
sleep 1
# Mounted volume "/srv/var/hosts:/etc/hosts:ro" is used by tozd/docker-hosts service discovery and can be removed.
#docker run --detach=true --restart=always --name "${NAME}" --hostname "${NAME}" \
# --env VIRTUAL_HOST=${DOMAIN} --env VIRTUAL_URL=/ --env VIRTUAL_LETSENCRYPT=true \
# --env ROOT_URL=${SERVER} --env MAIL_URL=smtp://mail.tnode.com  \
# --volume "${CONFIG}:/etc/service/meteor/run.config" \
# --volume "${METEOR_LOG}:/var/log/meteor" \
# ${DOCKER_TAG}

docker run -d \
 --name "${NAME}" --hostname "${NAME}" \
 --env ROOT_URL=${SERVER} \
 --volume ${CONFIG}:"/etc/service/meteor/run.config" \
 --link ${NAME}_mongodb:mongo \
 --publish="8080:80" \
 ${DOCKER_TAG}

docker ps -s
