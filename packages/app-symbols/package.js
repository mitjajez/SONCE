Package.describe({
  name: 'app-symbols',
  summary: 'Electric symbols section',
  version: '1.0.0'
});

Package.onUse(function (api) {
  api.use([
    'app-index',
    'app-elements'
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
