#!/bin/bash
VERSION="dev" #latest
BUILD_DIR="/home/mitja/Dokumenti/SONCE/docker-build"
DOCKER_TAG="mitjajez/sonce"
SERVER="http://sonce.se" # .se as shematic editor / .be may be as board editor

#rm -rf ${BUILD_DIR}
#mkdir -p ${BUILD_DIR}/bundle/

#echo "Building Meteor bundle to ${BUILD_DIR}"
#meteor build --architecture=os.linux.x86_64 --server=${SERVER} --directory ${BUILD_DIR}

#cp package.json ${BUILD_DIR}/bundle/
#cp Dockerfile ${BUILD_DIR}/bundle/
#cp .dockerignore ${BUILD_DIR}/bundle/
#cd ${BUILD_DIR}/bundle/

#meteor build --architecture=os.linux.x86_64 --server=${SERVER} ${BUILD_DIR}
#cd ${BUILD_DIR}/

if [ ! -z "$(docker images -qf "dangling=true")" ]
then
  echo
  echo "Cleaning building fail Dockerfile... images"
  docker rmi -f $(docker images -qf "dangling=true")
fi

if [ ! -z "$(docker ps -qa)" ]
then
  echo
  echo "Cleaning building fail Dockerfile... containers"
  docker rm -f $(docker ps -qa)
fi

echo
echo "Disk space is... "
df -h /

echo
echo "Building Dockerfile..."
docker build -t ${DOCKER_TAG}:${VERSION} .
