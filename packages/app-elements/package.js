Package.describe({
  name: 'app-elements',
  summary: 'Elements library',
  version: '1.0.0'
});

Package.onUse(function (api) {
  api.use([
    'app-index',
    'app-symbols'
  ]);

  api.addFiles([
    'elements.js'
  ], 'client');
});
