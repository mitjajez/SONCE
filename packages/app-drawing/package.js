Package.describe({
  name: 'app-drawing',
  summary: 'Drawing circuit',
  version: '1.0.0'
});

Package.onUse(function (api) {
  api.use([
//    'mitjajez:sonce'
  ]);

  api.addFiles([
  ], 'client');

  api.addFiles([
  ], ['client', 'server']);
});
