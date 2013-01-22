define(['messages'], function(messages) {

  function getXmppConfig() {
    return messages.getConfig('xmpp').
      then(function(config) {
        if(! config) {
          config = {};
        }
        if(! config.accounts) {
          config.accounts = {};
        }
        return config;
      });
  }

  function removeAccount(jid) {
    return getXmppConfig().
      then(function(config) {
        delete config.accounts[jid];
        return messages.setConfig('xmpp', config);
      });
  }

  function updateAccount(jid, accountConfig) {
    return getXmppConfig().
      then(function(config) {
        config.accounts[jid] = accountConfig;
        return messages.setConfig('xmpp', config);
      });
  }

  function renameAccount(oldJid, newJid) {
    return messages.getConfig('xmpp').
      then(function(config) {
        var accountConfig = config.accounts[oldJid];
        delete config.accounts[oldJid];
        config.accounts[newJid] = accountConfig;
        return messages.setConfig('xmpp', config);
      });
  }

  function renderAccount(jid, config) {
    var div = document.createElement('div');
    div.setAttribute('class', 'account');
    var jidRow = document.createElement('div');
    var jidLabel = document.createElement('label');
    jidLabel.innerHTML = "Jabber ID: ";
    jidRow.appendChild(jidLabel);
    var jidInput = document.createElement('input');
    jidInput.setAttribute('type', 'text');
    jidInput.setAttribute('placeholder', 'user@host');
    jidInput.setAttribute('name', 'jid');
    jidInput.value = jid;
    jidInput.addEventListener('blur', function() {
      var newJid = jidInput.value;
      if(newJid !== jid) {
        renameAccount(jid, newJid).then(function() {
          jid = newJid;
        });
      }
    });
    jidRow.appendChild(jidInput);
    div.appendChild(jidRow);
    var passwordRow = document.createElement('div');
    var passwordLabel = document.createElement('label');
    passwordLabel.innerHTML = 'Password: ';
    passwordRow.appendChild(passwordLabel);
    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('name', 'password');
    passwordInput.value = config.password || '';
    passwordInput.addEventListener('blur', function() {
      config.password = passwordInput.value;
      updateAccount(jid, config);
    });
    passwordRow.appendChild(passwordInput);
    div.appendChild(passwordRow);
    var removeButton = document.createElement('button');
    removeButton.innerHTML = "Remove account";
    removeButton.addEventListener('click', function() {
      removeAccount(jid).then(function() {
        div.parentElement.removeChild(div);
      });
    });
    div.appendChild(removeButton);
    return div;
  }

  function renderAccountList(accounts) {
    var list = document.createElement('div');

    for(var jid in accounts) {
      list.appendChild(renderAccount(jid, accounts[jid]));
    }

    return list;
  }

  function reloadAccounts(wrapper) {
    getXmppConfig().
      then(function(config) {
        
        var accountList = renderAccountList(config.accounts);
        wrapper.appendChild(accountList);

        var addButton = document.createElement('button');
        addButton.innerHTML = "Add account";

        addButton.addEventListener('click', function() {
          accountList.appendChild(renderAccount('', {}));
        });
        wrapper.appendChild(document.createElement('hr'));
        wrapper.appendChild(addButton);
      });
  }

  return {
    load: function(app, wrapper) {
      wrapper.innerHTML = '';

      var heading = document.createElement('h2');
      heading.innerHTML = 'Accounts';
      wrapper.appendChild(heading);

      reloadAccounts(wrapper);
    }
  };
});