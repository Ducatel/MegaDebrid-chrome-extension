
/* This script is use for display a translated ressource in HTML */

(function() {
  window.addEventListener("load", function() {
    var message, transObj, translatableObject, _i, _len, _results;
    translatableObject = document.getElementsByClassName('translatable');
    _results = [];
    for (_i = 0, _len = translatableObject.length; _i < _len; _i++) {
      transObj = translatableObject[_i];
      if (transObj.dataset && transObj.dataset.message) {
        message = chrome.i18n.getMessage(transObj.dataset.message);
        if (transObj.tagName.toLowerCase() === "input") {
          _results.push(transObj.value = message);
        } else {
          _results.push(transObj.innerHTML = message);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  });

}).call(this);
