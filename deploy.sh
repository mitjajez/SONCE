#!/bin/bash
VERSION=latest
CURRENT_DIR=`basename $PWD`
BUILD_DIR=`mktemp`
DOCKER_TAG=mitjajez/sonce
SERVER=http://sonce.io

rm -rf $BUILD_DIR

echo "Building to $BUILD_DIR"
meteor build --architecture=os.linux.x86_64 --server=$SERVER --directory $BUILD_DIR

cp package.json $BUILD_DIR/bundle/
cp Dockerfile $BUILD_DIR/bundle/
cp .dockerignore $BUILD_DIR/bundle/
cd $BUILD_DIR/bundle/

echo "Building Dockerfile..."
sudo docker build -t ${DOCKER_TAG}:${VERSION} . &&
sudo docker push ${DOCKER_TAG}:${VERSION}
