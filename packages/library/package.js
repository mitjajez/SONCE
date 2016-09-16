Package.describe({
  name: 'sonce:library',
  summary: 'SONCE Library of elements and symbols',
//  prodOnly: true,
  documentation: null,
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1.1');

  api.use([
    'ecmascript',
  ]);
  api.use([
  ], 'server');

  api.addFiles('library.js', 'server');

  api.addFiles('components.json', 'server', {isAsset: true});
  api.addFiles('symbols.json', 'server', {isAsset: true});
  api.export('ComponentsLib');
  api.export('SymbolsLib');

  api.addFiles('symbols.js', 'client');
  api.addAssets('symbols.svg', 'client');
});
