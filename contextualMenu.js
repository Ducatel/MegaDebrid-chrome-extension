
/*
 * Callback of "download now" menu entry
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
 */

(function() {
  var addCurrentPageToBasketMenuCallback, addLinkToBasket, addToBasketMenuCallback, downloadNowCurrentPageMenuCallback, downloadNowMenuCallback, getDebridLinkCurrentPage, getDebridLinkMenuCallback, titleEntry;

  downloadNowMenuCallback = function(info, tab) {
    var linkUrl;
    linkUrl = info['linkUrl'].trim();
    return debridLink([linkUrl], true);
  };


  /*
   * Callback of "download now current page" menu entry
   * @param  info Array of info on current link
   * @param  tab  Array of info on current tab
   */

  downloadNowCurrentPageMenuCallback = function(info, tab) {
    var currentPageUrl;
    currentPageUrl = info.pageUrl.trim();
    return debridLink([currentPageUrl], true);
  };


  /*
   * Add link inside the basket
   * @param url Url you want to add in basket
   */

  addLinkToBasket = function(url) {
    return chrome.storage.local.get({
      linksTodebrid: 'linksTodebrid'
    }, function(items) {
      var linksTodebrid, maxLinksInBasket;
      linksTodebrid = items.linksTodebrid;
      if (Object.prototype.toString.call(linksTodebrid) !== '[object Array]') {
        linksTodebrid = Array();
      }
      maxLinksInBasket = 10;
      if (linksTodebrid.length < maxLinksInBasket) {
        linksTodebrid.push(url);
        return chrome.storage.local.set({
          'linksTodebrid': linksTodebrid
        }, function() {
          return displayNotification(chrome.i18n.getMessage('link_added_basket'));
        });
      } else {
        return displayNotification(chrome.i18n.getMessage('max_link_in_basket'), true);
      }
    });
  };


  /*
   * Callback of "add to basket" menu entry
   * @param  info Array of info on current link
   * @param  tab  Array of info on current tab
   */

  addToBasketMenuCallback = function(info, tab) {
    return addLinkToBasket(info['linkUrl']);
  };


  /*
   * Callback of "add current page to basket" menu entry
   * @param  info Array of info on current link
   * @param  tab  Array of info on current tab
   */

  addCurrentPageToBasketMenuCallback = function(info, tab) {
    return addLinkToBasket(info.pageUrl);
  };


  /*
   * Callback of "get debrid link" menu entry
   * @param  info Array of info on current link
   * @param  tab  Array of info on current tab
   */

  getDebridLinkMenuCallback = function(info, tab) {
    var linkUrl;
    linkUrl = info['linkUrl'].trim();
    return debridLink([linkUrl], false);
  };


  /*
   * Callback of "get debrid link for current page" menu entry
   * @param  info Array of info on current link
   * @param  tab  Array of info on current tab
   */

  getDebridLinkCurrentPage = function(info, tab) {
    var currentPageUrl;
    currentPageUrl = info.pageUrl.trim();
    return debridLink([currentPageUrl], false);
  };

  chrome.contextMenus.removeAll();

  titleEntry = chrome.i18n.getMessage('context_menu_download_menu');

  chrome.contextMenus.create({
    "title": titleEntry,
    "contexts": ["link"],
    "onclick": downloadNowMenuCallback
  });

  titleEntry = chrome.i18n.getMessage('context_menu_get_debrided_link');

  chrome.contextMenus.create({
    "title": titleEntry,
    "contexts": ["link"],
    "onclick": getDebridLinkMenuCallback
  });

  titleEntry = chrome.i18n.getMessage('context_menu_add_basket');

  chrome.contextMenus.create({
    "title": titleEntry,
    "contexts": ["link"],
    "onclick": addToBasketMenuCallback
  });

  titleEntry = chrome.i18n.getMessage('context_menu_download_basket');

  chrome.contextMenus.create({
    "title": titleEntry,
    "contexts": ["all"],
    "onclick": downloadAllBasket
  });

  titleEntry = chrome.i18n.getMessage('context_menu_download_current_page');

  chrome.contextMenus.create({
    title: titleEntry,
    "contexts": ["all"],
    "onclick": downloadNowCurrentPageMenuCallback
  });

  titleEntry = chrome.i18n.getMessage('context_menu_debrid_current_page');

  chrome.contextMenus.create({
    "title": titleEntry,
    "contexts": ["all"],
    "onclick": getDebridLinkCurrentPage
  });

  titleEntry = chrome.i18n.getMessage('context_menu_add_current_page_basket');

  chrome.contextMenus.create({
    "title": titleEntry,
    "contexts": ["all"],
    "onclick": addCurrentPageToBasketMenuCallback
  });

}).call(this);
