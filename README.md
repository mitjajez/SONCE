#SONCE
Meteor version of SONCE is up to be used as educational tool and could be the new way of communication with as./prof./mentor while learning electronics by drawing and testing. Get focus on how circuit work and not how to get simulation result. See topology of circuit, see all available matrixes.
##Ideas

##History

The idea started in 2007 as need for fast svg circuit editor as plugin for MediaWiki that was used for student's lecture notes. First try was made with svg-only with javascript inside - You can fork **xeagle** branch.
Then my colleague come with C# knowledge and start building new Silverlight version. This source code is avaliabe on http://sonce.codeplex.com/. I was very sceptical about SilverLight as i'm about all from M$.
In 2010 I met the jQuery library and it blows my mind, so i made new branch **SONCEjQ**. It uses jquery.svg plugin. It generates svg while drawing and also build circuit's XML, but with nodes as root. Just like is needed in matrix to calculate circuit.
After many years of doing different things I switched from jQuery do nodejs and met meteor. In 2016 it was also deadline to get my degree. So this came up.