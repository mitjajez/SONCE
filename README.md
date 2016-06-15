# Simple ONline Circuit Editor

[![Build Status](https://travis-ci.org/mitjajez/SONCE.svg?branch=master)](https://travis-ci.org/mitjajez/SONCE)
[![CircleCI](https://circleci.com/gh/mitjajez/SONCE.svg?style=svg)](https://circleci.com/gh/mitjajez/SONCE)
[![Code Climate](https://codeclimate.com/github/mitjajez/SONCE/badges/gpa.svg)](https://codeclimate.com/github/mitjajez/SONCE)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/mitjajez/SONCE/master/LICENCE.md)

[![dockeri.co](http://dockeri.co/image/mitjajez/sonce)](https://registry.hub.docker.com/mitjajez/sonce/)

* [Deployment](#deployment)
* [Development](#development)
  * [Quick Start](#quick-start-for-code-developers)
* [About SONCE](#about-sonce)
  * [Roadmap](#roadmap)
* [Donate](#donate)

# Deployment

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

SONCE is under heavy development and the amount of functionality will grow in the future. Contributions are welcome.

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

Meteor version of SONCE is up to be used as educational tool and could be the new way of communication with as./prof./mentor while learning electronics by drawing and testing. Get focus on how circuit work and not how to get simulation result. See topology of circuit, see all available matrixes.

## Roadmap

#### In Progress
* Circuit Netlist
* Circuit Matrics

#### Planned
* Graphviz circuit graph with viz.js
* Editing wires
* Mentor mode ("read-only", zoom, pan, mouse)
* Save circuit view for registered users

## Ideas

SONCE is slovenian sun.


## License

Note that SONCE is distributed under the [MIT License](http://opensource.org/licenses/MIT).

# Donate
SONCE will be free forever, but you can help us speed-up the development!

[![flattr.com](https://button.flattr.com/flattr-badge-large.png)](https://flattr.com/submit/auto?fid=w7dn30&url=https%3A%2F%2Fgithub.com%2Fmitjajez%2FSONCE)



# History

The idea started in 2007 as need for fast svg circuit editor as plugin for MediaWiki that was used for student's lecture notes. First try was made with svg-only with javascript inside - You can fork [**xeagle** branch](https://github.com/mitjajez/SONCE/tree/xeagle).
Then my colleague come with C# knowledge and start building new Silverlight version. This source code is avaliabe on [codeplex](http://sonce.codeplex.com/). I was very sceptical about SilverLight as i'm about all products from M$ (or. about close source in general)
In 2010 I met the jQuery library and it blows my mind, so i made new branch [**SONCEjQ**](https://github.com/mitjajez/SONCE/tree/SONCEjQ). It uses jquery.svg plugin. It generates svg while drawing and also build circuit's XML, but with nodes as root. Just like is needed in matrix to calculate circuit.
After many years of doing different things I switched from jQuery to nodejs and met meteor. In 2016 it was also deadline to get my degree. So this came up.
