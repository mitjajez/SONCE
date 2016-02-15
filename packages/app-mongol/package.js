Package.describe({
  summary: 'Mongol tool for Mongo Debuging',
  version: '1.0.0'
});

Package.onUse(function (api) {

  api.use([
    'session'
  ]);

  // 3rd party dependencies.
  api.use([
    'msavin:mongol'
  ]);

  api.addFiles([
    'mongol.cfg.js'
  ], 'client');

});
