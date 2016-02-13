Package.describe({
  summary: 'App index',
  version: '0.1.0',
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
//    'ecmascript',
//    'meteor-platform',
    'mongo',
    'force-ssl',
    'spacebars',
    'jquery',
    'underscore',
    'webapp'
  ]);

  // 3rd party dependencies.
  api.use([
    'twbs:bootstrap',
    'fourseven:scss',
    'peerlibrary:blaze-components'
  ]);

  // Expose these to the global namespace
  api.imply([
    'app-elements',
    'app-symbols',
    'peerlibrary:blaze-components'
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
