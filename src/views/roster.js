define(['xmpp/roster'], function(roster) {

  var PRESENCES = {
    '': 'Available',
    'busy': 'Busy',
    'away': 'Away',
    'dnd': 'Do not disturb'
  };

  var listElement;

  function findElement(buddy) {
    var cl = listElement.children.length;
    for(var i=0;i<cl;i++) {
      var li = listElement.children[i];
      if(li.getAttribute('data-jid') === buddy.jid) {
        return li;
      }
    }
  }

  function renderBuddy(buddy, li) {
    if(! li) {
      li = document.createElement('li');
    }
    li.setAttribute('data-jid', buddy.jid);
    li.innerHTML = buddy.jid;
    return li;
  }

  function renderMyPresence() {
    var div = document.createElement('div');
    var spinner = document.createElement('img');
    spinner.setAttribute('src', 'img/spinner.gif');
    spinner.style.display = 'none';
    function updatePresence() {
      spinner.style.display = 'block'
      roster.setPresence(typeSelect.value, statusInput.value, function() {
        spinner.style.display = 'none';
      });
    }
    var typeRow = document.createElement('div');
    var label = document.createElement('label');
    label.innerHTML = "My presence: ";
    typeRow.appendChild(label);
    var typeSelect = document.createElement('select');
    for(var key in PRESENCES) {
      var option = document.createElement('option');
      option.setAttribute('value', key);
      option.innerHTML = PRESENCES[key];
      typeSelect.appendChild(option);
    }
    typeSelect.addEventListener('change', updatePresence);
    typeRow.appendChild(typeSelect);
    div.appendChild(typeRow);
    var statusRow = document.createElement('div');
    var statusLabel = document.createElement('label');
    statusLabel.innerHTML = "My status: ";
    statusRow.appendChild(statusLabel);
    var statusInput = document.createElement('input');
    statusInput.addEventListener('blur', updatePresence);
    statusRow.appendChild(statusInput);
    div.appendChild(statusRow);
    div.appendChild(spinner);
    // send initial presence
    setTimeout(updatePresence, 0);
    return div;
  }

  return {
    load: function(app, wrapper) {
      listElement = document.createElement('ul');
      wrapper.innerHTML = '';

      var heading = document.createElement('h2');
      heading.innerHTML = 'Buddy list';

      wrapper.appendChild(heading);
      wrapper.appendChild(renderMyPresence());
      wrapper.appendChild(listElement);

      roster.on('add', function(buddy) {
        listElement.appendChild(renderBuddy(buddy));
      });

      roster.on('remove', function(buddy) {
        listElement.removeChild(findElement(buddy));
      });

      roster.on('update', function(buddy) {
        renderBuddy(buddy, findElement(buddy));
      });

    }
  };

});
