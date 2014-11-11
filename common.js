
/*
 * Debrid links
 * @param  array of links you want to debrid
 * @param autoDownload If true download the debrided link, false copy the link
 */

(function() {
  window.debridLink = function(links, autoDownload) {
    return chrome.storage.sync.get({
      token: 'token'
    }, function(items) {
      var api_url, err, link, xhr, _i, _len, _results;
      if (chrome.runtime.lastError) {
        displayNotification(chrome.i18n.getMessage("no_account_error"), true);
        return;
      }
      api_url = "http://www.mega-debrid.eu/api.php?action=getLink&token=" + items.token;
      _results = [];
      for (_i = 0, _len = linksTodebrid.length; _i < _len; _i++) {
        link = linksTodebrid[_i];
        xhr = new XMLHttpRequest();
        try {
          xhr.onreadystatechange = function() {
            var jsonResponse, newLink;
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
              jsonResponse = JSON.parse(xhr.responseText);
              console.log(jsonResponse);
              if (jsonResponse['response_code'] === "ok") {
                newLink = jsonResponse['debridLink'].trim().slice(1, -1);
                if (autoDownload) {
                  return chrome.downloads.download({
                    url: newLink
                  });
                } else {
                  return copyToClipboard(newLink);
                }
              } else if (jsonResponse['response_code'] === 'TOKEN_ERROR') {
                reLogin(function() {
                  return debridLink(link, autoDownload);
                });
              } else {
                return displayNotification(chrome.i18n.getMessage('undefined_error_debird_link') + "\n" + link, true);
              }
            }
          };
          xhr.onerror = function(error) {
            return console.error(error);
          };
          xhr.open("POST", api_url, true);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          _results.push(xhr.send("link=" + link));
        } catch (_error) {
          err = _error;
          _results.push(console.error(err));
        }
      }
      return _results;
    });
  };

  window.reLogin = function(callback) {
    console.log(callback);
    return chrome.storage.sync.get({
      login: 'login',
      password: 'password'
    }, function(items) {
      var err, login, password, url, xhr;
      login = items.login;
      password = items.password;
      xhr = new XMLHttpRequest;
      try {
        xhr.onreadystatechange = function() {
          var jsonResponse;
          if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
            jsonResponse = JSON.parse(xhr.responseText);
            if (jsonResponse["response_code"].trim() === "ok") {
              return chrome.storage.sync.set({
                'token': jsonResponse["token"]
              }, callback);
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
        err = _error;
        return console.error(err);
      }
    });
  };


  /*
   * Copy variable to clipboard
   * @param text The value you want to copy in the clipboard
   */

  window.copyToClipboard = function(text) {
    var copyDiv;
    copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
    return displayNotification(chrome.i18n.getMessage('url_copied_in_clipboard'));
  };


  /*
   * Display a notification
   * @param  msg The message you want to display
   * @param isError If true display a notification for error else standard notification. Default value: false
   */

  window.displayNotification = function(msg, isError) {
    var opt;
    isError = typeof isError !== 'undefined' ? isError : false;
    opt = {
      type: "basic",
      title: "Mega-Debrid",
      message: msg
    };
    if (isError) {
      opt['iconUrl'] = chrome.extension.getURL("img/errorIcon.png");
      opt['eventTime'] = Date.now() + 15000;
    } else {
      opt['iconUrl'] = chrome.extension.getURL("img/icon128.png");
      opt['eventTime'] = Date.now() + 3000;
    }
    return chrome.notifications.create("", opt, function(notificationId) {});
  };


  /*
   * Dowload all links in basket
   * @param callback function called at the end
   */

  window.downloadAllBasket = function(callback) {
    return chrome.storage.local.get({
      linksTodebrid: 'linksTodebrid'
    }, function(items) {
      var listOfLinks;
      listOfLinks = items.linksTodebrid;
      if (Object.prototype.toString.call(listOfLinks) === '[object Array]') {
        debridLink(listOfLinks, true);
        if (typeof callback === 'function') {
          return chrome.storage.local.remove('linksTodebrid', callback);
        } else {
          return chrome.storage.local.remove('linksTodebrid');
        }
      }
    });
  };

}).call(this);
