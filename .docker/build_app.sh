curl https://install.meteor.com | /bin/sh

cp -R /clone /source
cd /source
npm install

mkdir -p /app/bundle/
meteor build --architecture=os.linux.x86_64 --directory /app --server=http://localhost:3000
cd /app/bundle/programs/server/
npm install

ls -lh /app/bundle

# cleanup
rm -rf /clone
rm -rf ~/.meteor
rm /usr/local/bin/meteor
rm -rf /source
