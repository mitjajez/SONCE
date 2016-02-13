Package.describe({
  summary: 'App index',
  version: '0.1.0',
  name: 'app-core',
  git: "https://github.com/mitjajez/SONCE.git"
});

/* This defines your actual package */
Package.onUse(function (api) {
  api.versionsFrom('1.2.0.1');

  // Core dependencies.
  api.use([
//    'meteor-platform',
    'force-ssl',
    'spacebars',
    'jquery',
    'underscore'
  ]);

  // 3rd party dependencies.
  api.use([
    'fourseven:scss',
    'peerlibrary:blaze-components'
  ]);

  // Expose these to the global namespace
  api.imply([
    'peerlibrary:blaze-components',
    'underscore',
    'templating'
  ]);

 // Internal dependencies.
  api.use([
    'app-elements',
    'app-symbols'
  ]);

  api.addFiles([
    'index.html',
    'index.js',
    'index.scss'
  ], 'client');

  api.addFiles([
    'startup.js'
  ], 'server');

  api.addFiles([
    'common.js'
  ], ['client', 'server']);

  api.addAssets('library/library.json', ['server', 'client']);
  api.addAssets('library/symbols.json', ['server', 'client']);
});
