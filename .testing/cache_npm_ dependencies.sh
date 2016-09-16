# Cache npm deps
if [ ! -e /home/ubuntu/nvm/versions/node/v4.5.0/lib/node_modules/chimp/bin/chimp.js ]; then
  echo "install chimp";
  npm install -g chimp;
fi
if [ ! -e /home/ubuntu/nvm/versions/node/v4.5.0/lib/node_modules/spacejam/bin/spacejam ]; then
  echo "install spacejam";
  npm install -g spacejam;
fi
echo "install dependencies";
npm install
