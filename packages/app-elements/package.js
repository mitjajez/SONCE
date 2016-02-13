Package.describe({
  name: 'app-elements',
  summary: 'Elements library',
  version: '1.0.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  api.use([
    'spacebars'
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:blaze-components'
  ]);

  api.addFiles([
    'elements.html',
    'elements.js'
  ], 'client');
});
