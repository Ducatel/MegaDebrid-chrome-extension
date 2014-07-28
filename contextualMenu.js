/*******************************************************************/
/**              This script manage the contextual menu           **/
/*******************************************************************/

/**
 * Callback of "download now" menu entry 
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
 */
function downloadNowMenuCallback(info, tab){
	var linkUrl = info['linkUrl'].trim();
	debridLink( [ linkUrl ] , true );
}

/**
 * Callback of "add to basket" menu entry 
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
 */
function addToBasketMenuCallback(info, tab){

	chrome.storage.local.get( { linksTodebrid: 'linksTodebrid' }, 
	function(items) {
		var linksTodebrid = items.linksTodebrid;
		if( Object.prototype.toString.call( linksTodebrid ) !== '[object Array]' ) 
    		linksTodebrid = Array();
		
		var maxLinksInBasket = 10;
		if(linksTodebrid.length < maxLinksInBasket ){
			linksTodebrid.push(info['linkUrl']);
			chrome.storage.local.set({'linksTodebrid': linksTodebrid}, function() {
				displayNotification(chrome.i18n.getMessage('link_added_basket'));
			});
		}
		else
			displayNotification(chrome.i18n.getMessage('max_link_in_basket'), true);
	});

}

/**
 * Callback of "get debrid link" menu entry 
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
 */
function getDebridLinkMenuCallback(info, tab){
	var linkUrl = info['linkUrl'].trim();
	debridLink( [ linkUrl ], false );
}

chrome.contextMenus.removeAll();

var title = chrome.i18n.getMessage('context_menu_download_menu');
chrome.contextMenus.create({"title": title, "contexts":["link"], "onclick": downloadNowMenuCallback});

title = chrome.i18n.getMessage('context_menu_get_debrided_link');
chrome.contextMenus.create({"title": title, "contexts":["link"], "onclick": getDebridLinkMenuCallback});

title = chrome.i18n.getMessage('context_menu_add_basket');
chrome.contextMenus.create({"title": title, "contexts":["link"], "onclick": addToBasketMenuCallback});






