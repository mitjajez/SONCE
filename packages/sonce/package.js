Package.describe({
  summary: 'App index',
  version: '0.1.1',
  name: 'mitjajez:sonce',
  git: "https://github.com/mitjajez/SONCE.git"
});

/* This defines your actual package */
Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  // Internal dependencies.
   api.use([
     'app-elements',
     'app-symbols',
     'app-mongol'
   ]);

   // Core dependencies.
  api.use([
    'mongo',
    'minimongo',
    'force-ssl',
    'jquery'
  ]);

  // 3rd party dependencies.
  api.use([
    'twbs:bootstrap',
    'fourseven:scss',
    'peerlibrary:blaze-components'
  ]);

  api.export('Elements');
  api.export('Symbols');

  // Expose these to the global namespace
  api.imply([
  ]);

  api.addFiles([
    'common.js'
  ], ['client', 'server']);

  api.addAssets([
    'library/symbols.json',
    'library/library.json'
  ], 'server');

  api.addFiles([
    'startup.js'
  ], 'server');

  api.addFiles([
    'index.html',
    'index.js',
    'index.scss'
  ], 'client');
});
