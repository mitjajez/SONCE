# Cache Meteor
if [ ! -e /home/ubuntu/.meteor/meteor ]; then curl https://install.meteor.com | sh; fi
if [ -d /home/ubuntu/.meteor ]; then sudo ln -s /home/ubuntu/.meteor/meteor /usr/local/bin/meteor; fi
