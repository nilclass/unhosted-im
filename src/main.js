
require.config({
  paths: {
    remotestorage: '../lib/remoteStorage.js/src'
  }
});

define(['app', 'remotestorage/remoteStorage'], function(app, remoteStorage) {

  window.addEventListener('load', app.init);
  window.addEventListener('popstate', app.dispatch);
  remoteStorage.onWidget('ready', app.connected);
  remoteStorage.onWidget('disconnect', app.disconnected);

});
