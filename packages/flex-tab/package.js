Package.describe({
  name: 'flextab',
  version: '1.0.0',
  summary: 'TabBar from RocketChat',
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1.1');
  api.use([
    'mongo',
    'ecmascript',
    'templating',
    'coffeescript',
    'underscore',
    'reactive-var',
    'tracker',
  ]);
  api.use('rate-limit');
  api.use('reactive-dict');
  api.use('random');
  api.use('check');
  api.use('ddp-rate-limiter');
  api.use('service-configuration');
  api.use('check');
  api.use('kadira:flow-router', 'client');
  api.use('tap:i18n');

  api.addFiles([
    'TabBar.coffee',
    'ElementAction.coffee',
    'WireAction.coffee',
  ], 'client');

  api.export('TabBar');
  api.export('ElementAction');
  api.export('WireAction');

//  api.addFiles('flex-tab/tabs/membersList.html', 'client');

});

Package.onTest(function(api) {
  api.use(['ecmascript', 'tinytest', 'flexbar', 'underscore']);
//  api.addFiles('factory-tests.js', 'server');
});
