FROM node:0.10

# crafted and tuned by pierre@ozoux.net and sing.li@rocket.chat
MAINTAINER Mitja Jež <mitja@xn--je-3va.si>

#RUN groupadd -r sonce \
#&&  useradd -r -g sonce sonce

ONBUILD COPY ./ /tmp/source
ONBUILD RUN cp -R /tmp/source /source \
  && cd /source \
  && npm install \
  && ls /source

ONBUILD RUN curl https://install.meteor.com | /bin/sh
ONBUILD RUN meteor --version && ls /app

ONBUILD RUN mkdir /app \
  && meteor build --architecture=os.linux.x86_64 --directory /app --server=http://localhost:3000 \
  && cd /app/bundle/programs/server/ \
  && npm install \
  && ls /app

# cleanup
ONBUILD \
  RUN rm -rf /tmp/source \
  && rm -rf ~/.meteor \
  && rm /usr/local/bin/meteor \
  && rm -rf /source

VOLUME /app/uploads

WORKDIR /app
RUN ls /app

#USER sonce

WORKDIR /app/bundle
RUN ls /app/bundle


# needs a mongoinstance - defaults to container linking with alias 'db'
ENV MONGO_URL=mongodb://db:27017/meteor \
    HOME=/tmp \
    PORT=3000 \
    ROOT_URL=http://localhost:3000 \
    Accounts_AvatarStorePath=/app/uploads

EXPOSE 3000/tcp

CMD ["node", "main.js"]
