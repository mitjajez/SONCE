#!/bin/bash
set -e

#install base
apt-get update && apt-get install -y \
    nodejs-legacy \
    build-essential

apt-get autoremove
apt-get clean

rm -rf /var/lib/apt/lists/*

#install meteor
curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh
meteor --version
