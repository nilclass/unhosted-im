define([], function() {

  var eventHandlers = {
    'add': [],
    'remove': [],
    'update': []
  };

  return {
    on: function(eventName, handler) {
      var handlers = eventHandlers[eventName];
      if(! handlers) {
        throw "No such event: " + eventName;
      }
      handlers.push(handler);
    },

    setPresence: function(type, status, callback) {
      console.log("PRESENCE NOW: ", 'type', type, 'status', status);
      setTimeout(callback, 1500);
    }
  };
});
