#!/bin/bash
VERSION="dev" #latest
BUILD_DIR="/home/mitja/Dokumenti/SONCE/build"
DOCKER_TAG="mitjajez/sonce"
SERVER="http://sonce.se" # .se as shematic editor / .be may be as board editor

rm -rf ${BUILD_DIR}
mkdir -p ${BUILD_DIR}/bundle/

echo "Building Meteor bundle to ${BUILD_DIR}"
meteor build --architecture=os.linux.x86_64 --server=${SERVER} --directory ${BUILD_DIR}
#meteor build --architecture=os.linux.x86_64 --server=${SERVER} ${BUILD_DIR} #.tar.gz
