# Simple ONline Circuit Editor

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/RocketChat/Rocket.Chat/raw/master/LICENSE)

* [Development](#development)
 * [Quick Start](#quick-start-for-code-developers)


Meteor version of SONCE is up to be used as educational tool and could be the new way of communication with as./prof./mentor while learning electronics by drawing and testing. Get focus on how circuit work and not how to get simulation result. See topology of circuit, see all available matrixes.

# Development

## Quick start for code developers
Prerequisites:

* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Meteor](https://www.meteor.com/install)

Now just clone and start the app:

```sh
git clone https://github.com/mitjajez/SONCE.git
cd SONCE
meteor npm install
meteor
```

## Roadmap

#### In Progress

#### Planned

## Ideas

SONCE is slovenian sun.

## License

Note that Rocket.Chat is distributed under the [MIT License](http://opensource.org/licenses/MIT).


## History

The idea started in 2007 as need for fast svg circuit editor as plugin for MediaWiki that was used for student's lecture notes. First try was made with svg-only with javascript inside - You can fork [**xeagle** branch](https://github.com/mitjajez/SONCE/tree/xeagle).
Then my colleague come with C# knowledge and start building new Silverlight version. This source code is avaliabe on [codeplex](http://sonce.codeplex.com/). I was very sceptical about SilverLight as i'm about all products from M$ (or. about close source in general)
In 2010 I met the jQuery library and it blows my mind, so i made new branch [**SONCEjQ**](https://github.com/mitjajez/SONCE/tree/SONCEjQ). It uses jquery.svg plugin. It generates svg while drawing and also build circuit's XML, but with nodes as root. Just like is needed in matrix to calculate circuit.
After many years of doing different things I switched from jQuery do nodejs and met meteor. In 2016 it was also deadline to get my degree. So this came up.
