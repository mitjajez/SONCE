# https://medium.com/@fermuch/meteor-1-3-docker-the-right-way-9b3ab9cc9403
FROM node:0.10.43
MAINTAINER Mitja Jež <mitja@xn--je-3va.si>

# FIX
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Prebuild everything, so we dont push it everytime
# install meteor dependencies
### ADD programs/server/package.json /tmp/package.json
### RUN cd /tmp && npm install

# now our dependencies
RUN npm install --production

ENV PORT 80
EXPOSE 80

CMD ["node", "main.js"]
