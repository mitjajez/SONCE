Package.describe({
  summary: 'App index',
  version: '0.1.2',
  name: 'mitjajez:sonce',
  git: "https://github.com/mitjajez/SONCE.git"
});

/* This defines your actual package */
Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  // Internal dependencies.
   api.use([
     'app-elements',
     'app-symbols'
   ]);

   // Core dependencies.
  api.use([
    'session',
    'reactive-var',
    'mongo',
    'minimongo',
    'force-ssl',
    'jquery'
  ]);

  // 3rd party dependencies.
  api.use([
    'twbs:bootstrap',
    'fourseven:scss',
    'peerlibrary:blaze-components',
    'jeremy:snapsvg'
//    'd3js:d3'
  ]);

  api.export('Elements');
  api.export('Symbols');
  api.export('Circuit');

  // Expose these to the global namespace
  api.imply([
  ]);

  api.addFiles([
    'common.js'
  ], ['client', 'server']);

  api.addAssets([
//    'library/symbols.svg',
    'library/symbols.json',
    'library/library.json'
  ], 'server');

  api.addFiles([
    'startup.js'
  ], 'server');

  api.addFiles([
    'navigation.html',
    'svgCanvas.html',
    'index.html',
    'index.js',
    'index.scss'
  ], 'client');

  api.use([
    'msavin:mongol'
  ]);

  api.addFiles([
    'debug/mongol-cfg.js'
  ], 'client');
});
