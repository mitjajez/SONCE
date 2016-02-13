Package.describe({
  name: 'app-symbols',
  summary: 'Electric symbols section',
  version: '1.0.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');
  // Core dependencies.
  api.use([
    'spacebars',
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:blaze-components'
  ]);

  api.addFiles([
    'symbolsList.html',
    'symbolsList.js',
    'symbols.html',
    'symbols.js',
    'editSymbol.html',
    'editSymbol.js'
  ], 'client');

  api.addFiles([

  ], ['client', 'server']);
});
