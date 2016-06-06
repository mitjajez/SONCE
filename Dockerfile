#FROM node:0.10 #TAR problems?
FROM debian:wheezy
MAINTAINER Mitja Jež <mitja@xn--je-3va.si>

RUN groupadd -r sonce \
&&  useradd -r -g sonce sonce

ENV DOCKER /opt/docker
COPY .docker $DOCKER
COPY ./ /clone
RUN /bin/bash install.sh
RUN /bin/bash $DOCKER/build_app.sh
RUN /bin/bash install.sh

VOLUME /app/uploads

WORKDIR /app

USER sonce

WORKDIR /app/bundle

ENV METEOR_SETTINGS={}

ENTRYPOINT bash $DOCKER/run_app.sh
