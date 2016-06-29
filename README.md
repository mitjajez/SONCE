# Simple ONline Circuit Editor

[![Build Status](https://travis-ci.org/mitjajez/SONCE.svg?branch=master)](https://travis-ci.org/mitjajez/SONCE)
[![CircleCI](https://circleci.com/gh/mitjajez/SONCE.svg?style=svg)](https://circleci.com/gh/mitjajez/SONCE)
[![Code Climate](https://codeclimate.com/github/mitjajez/SONCE/badges/gpa.svg)](https://codeclimate.com/github/mitjajez/SONCE)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/mitjajez/SONCE/master/LICENCE.md)

[![dockeri.co](http://dockeri.co/image/mitjajez/sonce)]([docker_image])

# Table of Contents
* [Deployment](#deployment)
* [Development](#development)
  * [Quick Start](#quick-start-for-code-developers)
* [About SONCE](#about-sonce)
  * [Roadmap](#roadmap)
* [Donate](#donate)

# Deployment

[![Deploy][heroku_button]][heroku_deploy]

## Docker

Use the automated build image of our [most recent release](https://hub.docker.com/r/mitjajez/sonce/)

```sh
docker pull mitjajez/sonce:latest
```

## Building from source
If you have installed node and meteor properly, skip to [Building](#building)

**Debian users** need install newer *node*, and "link" nodejs to node:
```sh
curl -sL https://deb.nodesource.com/setup_0.12 | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y nodejs-legacy
```

### Building
```sh
git clone https://github.com/mitjajez/SONCE.git
cd SONCE && npm install --production
meteor build --architecture=os.linux.x86_64 --directory /path/build-dir
cd /path/build-dir/
cd bundle/programs/server/ && npm install && cd ../../..
```
### Running
Start your mongod db and run sonce:
```
docker run -d --name "sonce_mongodb" mongo
PORT=3000 MONGO_URL=mongodb://localhost:27017/sonce ROOT_URL=http://localhost node bundle/main.js
```

# Development

## Status & Contributing

SONCE is under heavy development and the amount of functionality will grow in
the future. Contributions are welcome. Please see
[CONTRIBUTING.md](https://github.com/mitjajez/SONCE/blob/master/CONTRIBUTING.md)

## Quick start for code developers
Prerequisites:

* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Meteor](https://www.meteor.com/install)

Now just clone and start the app:

```sh
git clone https://github.com/mitjajez/SONCE.git
cd SONCE && npm install
meteor
```
# About SONCE

Meteor version of SONCE is up to be used as educational tool and could be the
new way of communication with as./prof./mentor while learning electronics by
drawing and testing. Get focus on how circuit work and not how to get simulation
result. See topology of circuit, see all available matrixes.

## Roadmap

#### In Progress
* Adding Elements value editor
* Adding Circuit net-based Netlist
* Graphviz circuit graph with viz.js
* SVG export

#### Planned
* Circuit Matrics
* REST API
* netlist api URL: circuit/:id/svg
* svg embed URL: circuit/:id/svg
* warning on SC, OC
* Make circuit as component
* Moving Elements
* Editing wires
* Mentor mode ("read-only", zoom, pan, mouse)
* Save circuit view for registered users
* Embeding MediaWiki, Moodle, ...

#### Wishlist
Submit issue for wanted features on
[Github Issues](https://github.com/mitjajez/SONCE/issues)

## Ideas

SONCE is slovenian sun.


## License

Note that SONCE is distributed under the [MIT License](http://opensource.org/licenses/MIT).

# Donate
SONCE will be free forever, but you can help us speed-up the development!

[![flattr.com](https://button.flattr.com/flattr-badge-large.png)](https://flattr.com/submit/auto?fid=w7dn30&url=https%3A%2F%2Fgithub.com%2Fmitjajez%2FSONCE)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=X6B3H2HX9C5XN&lc=SI&item_name=Mitja%20Jež&item_number=SONCE&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)
[![Gratipay Team](https://img.shields.io/gratipay/team/SONCE.svg?maxAge=2592000)](https://gratipay.com/SONCE/)

[docker_image]: https://hub.docker.com/r/mitjajez/sonce/
[heroku_button]: https://www.herokucdn.com/deploy/button.png
[heroku_deploy]: https://heroku.com/deploy?template=https://github.com/mitjajez/SONCE/tree/master
