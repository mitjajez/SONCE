FROM node:0.10

MAINTAINER Mitja Jež <mitja@xn--je-3va.si>

RUN groupadd -r sonce \
&&  useradd -r -g sonce sonce

ENV DOCKER /opt/docker
COPY .docker $DOCKER
COPY ./ /clone
RUN apt-get update && apt-get install -y \
 && rm -rf /var/lib/apt/lists/*

RUN /bin/bash $DOCKER/build_app.sh

VOLUME /app/uploads

WORKDIR /app

USER sonce

WORKDIR /app/bundle

ENV METEOR_SETTINGS={}

ENTRYPOINT bash $DOCKER/run_app.sh
