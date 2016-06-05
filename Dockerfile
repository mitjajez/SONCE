FROM node:0.10

# crafted and tuned by pierre@ozoux.net and sing.li@rocket.chat
MAINTAINER Mitja Jež <mitja@xn--je-3va.si>

#RUN groupadd -r sonce \
#&&  useradd -r -g sonce sonce

ENV DOCKER /opt/docker
ONBUILD COPY ./docker $DOCKER
ONBUILD COPY ./ /clone
ONBUILD RUN $DOCKER/build_app.sh

VOLUME /app/uploads

WORKDIR /app

#USER sonce

WORKDIR /app/bundle


# needs a mongoinstance - defaults to container linking with alias 'db'
ENV MONGO_URL=mongodb://db:27017/meteor \
    HOME=/tmp \
    PORT=3000 \
    ROOT_URL=http://localhost:3000 \
    Accounts_AvatarStorePath=/app/uploads

ENV METEOR_SETTINGS={}

ENTRYPOINT bash $DOCKER/run_app.sh
