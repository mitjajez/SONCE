FROM node:0.10
MAINTAINER Mitja Jež <mitja@xn--je-3va.si>

RUN groupadd -r sonce \
&&  useradd -r -g sonce sonce

ENV DOCKER /opt/docker
COPY .docker $DOCKER

COPY ./ /clone
#ENV METEOR_SETTINGS={}
RUN /bin/bash $DOCKER/install.sh \
  && /bin/bash $DOCKER/build_app.sh

USER sonce
VOLUME /app/uploads
#WORKDIR /app/bundle

ENTRYPOINT bash $DOCKER/run_app.sh
