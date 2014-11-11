
/*
 * Display an notification for display the error
 * @param   jsonResponse json API response
 */

(function() {
  var launchSave_options, printAPIError, restore_options, saveCredential, save_options;

  printAPIError = function(jsonResponse) {
    var msg;
    msg = chrome.i18n.getMessage('options_login_fail') + "\n";
    if (jsonResponse !== void 0) {
      if (jsonResponse["response_code"].trim() === "BANNED_ACCOUNT") {
        msg += " - " + jsonResponse["banned_reason"];
      } else if (jsonResponse["response_code"].trim() === "UNKNOWN_USER") {
        msg += " - " + jsonResponse["response_text"];
      }
    }
    return displayNotification(msg, true);
  };


  /*
   * Check if the credential are valid and
   * if is valid, save the login/password/token
   * @param  login   The login
   * @param  password The password
   */

  saveCredential = function(login, password) {
    var e, url, xhr;
    xhr = new XMLHttpRequest;
    try {
      xhr.onreadystatechange = function() {
        var jsonResponse;
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
          jsonResponse = JSON.parse(xhr.responseText);
          console.log("[DEBUG] saveCredential:");
          console.log(jsonResponse);
          if (jsonResponse["response_code"].trim() === "ok") {
            return chrome.storage.sync.set({
              'login': login,
              'password': password,
              'token': jsonResponse["token"]
            }, function() {
              return displayNotification(chrome.i18n.getMessage('options_save_complete'));
            });
          } else {
            return printAPIError(jsonResponse);
          }
        }
      };
      xhr.onerror = function(error) {
        return console.error(error);
      };
      url = "http://www.mega-debrid.eu/api.php?action=connectUser";
      url += "&login=" + encodeURIComponent(login);
      url += "&password=" + encodeURIComponent(password);
      xhr.open("GET", url, false);
      return xhr.send(null);
    } catch (_error) {
      e = _error;
      return console.error(e);
    }
  };


  /*
   * Save options to chrome storage
   */

  save_options = function() {
    var login, password;
    login = document.getElementById('login').value;
    password = document.getElementById('password').value;
    return saveCredential(login, password);
  };


  /*
   * Restore the option value
   */

  restore_options = function() {
    return chrome.storage.sync.get({
      login: 'login',
      password: 'password'
    }, function(items) {
      document.getElementById('login').value = items.login;
      return document.getElementById('password').value = items.password;
    });
  };


  /*
   * Launch the save_options function if event are keyup on enter key
   * @param  e event
   */

  launchSave_options = function(e) {
    e = e || window.event;
    if (e.keyCode === '13') {
      return save_options();
    }
  };

  window.addEventListener("load", function() {
    restore_options();
    document.getElementById('save').addEventListener('click', save_options);
    document.getElementById('login').onkeyup = launchSave_options;
    return document.getElementById('password').onkeyup = launchSave_options;
  });

}).call(this);
