curl --version
curl https://install.meteor.com | /bin/sh
meteor --version

cp -R /clone /source
cd /source
npm install
echo $(ls /source)

mkdir /app
meteor build --architecture=os.linux.x86_64 --directory /app --server=http://localhost:3000
cd /app/bundle/programs/server/
npm install
echo $(ls /app)

# cleanup
rm -rf /clone
rm -rf ~/.meteor
rm /usr/local/bin/meteor
rm -rf /source
