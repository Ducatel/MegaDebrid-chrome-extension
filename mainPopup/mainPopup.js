
/*
 * Load the content of the basket
 */

(function() {
  var deleteRow, downloadAllLinks, loadBasket, reduceDisplayedLink;

  loadBasket = function() {
    return chrome.storage.local.get({
      linksTodebrid: 'linksTodebrid'
    }, function(items) {
      var index, link, linkTableContent, listOfLinks, row, tableRow, tbody, _i, _j, _len, _len1, _results;
      listOfLinks = items.linksTodebrid;
      if (Object.prototype.toString.call(listOfLinks) !== '[object Array]') {
        listOfLinks = Array();
      }
      tbody = document.getElementById('listOfLinkTableBody');
      linkTableContent = "";
      for (index = _i = 0, _len = listOfLinks.length; _i < _len; index = ++_i) {
        link = listOfLinks[index];
        tableRow = "<tr id='row_" + index + "'><td>";
        tableRow += "<img class='deleteButton' src='../img/cross.png' id='deleteButton_" + index + "'/>";
        tableRow += "</td><td colspan='2' class='linkUrl'>" + (reduceDisplayedLink(link)) + "</td></tr>";
        linkTableContent += tableRow;
      }
      tbody.innerHTML = linkTableContent;
      _results = [];
      for (index = _j = 0, _len1 = listOfLinks.length; _j < _len1; index = ++_j) {
        link = listOfLinks[index];
        row = document.getElementById("deleteButton_" + index);
        _results.push(row.onclick = function(index) {
          return deleteRow(index);
        });
      }
      return _results;
    });
  };


  /*
   * Reduce the length of link
   * @param  link The link you want to minimize
   * @return the minimized link or the input link if the size is correct
   */

  reduceDisplayedLink = function(link) {
    if (link.length <= 83) {
      return link;
    }
    return link.slice(0, 81) + "...";
  };


  /*
   * Delete a link from basket and memeory
   * @param  rowId The row id where user has clicked
   */

  deleteRow = function(rowId) {
    return chrome.storage.local.get({
      linksTodebrid: 'linksTodebrid'
    }, function(items) {
      var index, link, listOfLinks, newListOfLinks, _i, _len;
      listOfLinks = items.linksTodebrid;
      newListOfLinks = Array();
      for (index = _i = 0, _len = listOfLinks.length; _i < _len; index = ++_i) {
        link = listOfLinks[index];
        if (index !== rowId) {
          newListOfLinks.push(link);
        }
      }
      return chrome.storage.local.set({
        'linksTodebrid': newListOfLinks
      }, loadBasket);
    });
  };


  /*
   * Donwload all links in basket and redraw the popup
   */

  downloadAllLinks = function() {
    return downloadAllBasket(loadBasket);
  };

  window.addEventListener("load", function() {
    loadBasket();
    return document.getElementById('saveButton').onclick = downloadAllLinks;
  });

}).call(this);
