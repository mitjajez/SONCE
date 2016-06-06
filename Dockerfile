FROM node:0.10
#FROM debian:wheezy
MAINTAINER Mitja Jež <mitja@xn--je-3va.si>

RUN groupadd -r sonce \
&&  useradd -r -g sonce sonce

ENV DOCKER /opt/docker
COPY .docker $DOCKER

COPY ./ /clone
#ENV METEOR_SETTINGS={}
RUN /bin/bash $DOCKER/install.sh \
  && /bin/bash $DOCKER/build_app.sh

WORKDIR /app
VOLUME /app/uploads

USER sonce
WORKDIR /app/bundle

ENTRYPOINT bash $DOCKER/run_app.sh
