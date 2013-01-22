
define(['remotestorage/remoteStorage'], function(remoteStorage) {

  remoteStorage.defineModule('messages', function(privateClient, publicClient) {
    return {
      exports: {
        init: function() {
          // BROKEN, https://github.com/RemoteStorage/remoteStorage.js/issues/214
          //privateClient.use('', true);
					//publicClient.release('');
        },

        getConfig: function(name) {
	        return privateClient.getObject('.' + name);
        },

        setConfig: function(name, config) {
          return privateClient.storeObject('config', '.' + name, config);
        }
      }
    };
  });

  return remoteStorage.messages;

});