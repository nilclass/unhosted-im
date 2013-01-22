
define([
  'remotestorage/remoteStorage',
  'messages',
  'views/root',
  'views/accounts'
], function(remoteStorage, messages, rootView, accountsView) {

  var introElement;
  var appElement
  var contentElement

  var app = {

    init: function() {
      remoteStorage.claimAccess({
        messages: 'rw'
      }).then(function() {
        remoteStorage.messages.init(); 
        remoteStorage.displayWidget('remotestorage-connect');
      });
      introElement = document.getElementById('intro');
      appElement = document.getElementById('app');
      contentElement = document.getElementById('content');
    },

    connected: function() {
      introElement.style.display = 'none';
      appElement.style.display = 'block';
    },

    disconnected: function() {
      appElement.style.display = 'none';
      introElement.style.display = 'block';
    },

    dispatch: function(event) {
      var md = String(document.location).match(/#!(.+)/);
      if(md) {
        switch(md[1]) {
        case 'accounts':
          accountsView.load(app, contentElement);
          break;
        default:
          // jump to root view
          document.location.hash = '';
        }
      } else {
        rootView.load(app, contentElement);
      }
    }

  };

  return app;
});
