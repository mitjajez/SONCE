FROM node:0.10

# crafted and tuned by pierre@ozoux.net and sing.li@rocket.chat
MAINTAINER Mitja Jež <mitja@xn--je-3va.si>

RUN groupadd -r sonce \
&&  useradd -r -g sonce sonce

ONBUILD COPY ./ /tmp/source
ONBUILD RUN cp -R /tmp/source /source \
  && cd /source \
  && npm install

ONBUILD RUN curl -L https://install.meteor.com | /bin/sh

ONBUILD RUN meteor build --architecture=os.linux.x86_64 --directory /app --server=http://localhost:3000 \
  && cd /app/bundle/programs/server/ \
  && npm install

# cleanup
ONBUILD \
  RUN rm -rf /tmp/source \
  && rm -rf ~/.meteor \
  && rm /usr/local/bin/meteor \
  && rm -rf /source \
  && echo $(ls /app)

VOLUME /app/uploads

WORKDIR /app

USER sonce

WORKDIR /app/bundle
RUN echo $(ls /app/bundle)


# needs a mongoinstance - defaults to container linking with alias 'db'
ENV MONGO_URL=mongodb://db:27017/meteor \
    HOME=/tmp \
    PORT=3000 \
    ROOT_URL=http://localhost:3000 \
    Accounts_AvatarStorePath=/app/uploads

EXPOSE 3000/tcp

CMD ["node", "main.js"]
