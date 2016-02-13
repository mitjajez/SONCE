Package.describe({
  name: 'app-drawing',
  summary: 'Drawing circuit',
  version: '1.0.0'
});

Package.onUse(function (api) {
  api.use([
    'app-core'
  ]);

  api.addFiles([
  ], 'client');

  api.addFiles([
  ], ['client', 'server']);
});
