###################################################################
##             This script manage the contextual menu            ##
###################################################################

###
# Callback of "download now" menu entry
# @param  info Array of info on current link
# @param  tab  Array of info on current tab
###
downloadNowMenuCallback = (info, tab) ->
	linkUrl = info['linkUrl'].trim()
	debridLink( [ linkUrl ] , true )


###
 * Callback of "download now current page" menu entry
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
###
downloadNowCurrentPageMenuCallback = (info, tab) ->
	currentPageUrl = info.pageUrl.trim()
	debridLink( [ currentPageUrl ], true )


###
 * Add link inside the basket
 * @param url Url you want to add in basket
###
addLinkToBasket = (url) ->

	chrome.storage.local.get( { linksTodebrid: 'linksTodebrid' }, (items) ->
		linksTodebrid = items.linksTodebrid
		if Object.prototype.toString.call( linksTodebrid ) isnt '[object Array]'
    		linksTodebrid = Array()

		maxLinksInBasket = 10;
		if linksTodebrid.length < maxLinksInBasket
			linksTodebrid.push(url)
			chrome.storage.local.set({'linksTodebrid': linksTodebrid}, () ->
				displayNotification(chrome.i18n.getMessage('link_added_basket'))
			)
		else
			displayNotification(chrome.i18n.getMessage('max_link_in_basket'), true)
	)


###
 * Callback of "add to basket" menu entry
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
###
addToBasketMenuCallback = (info, tab) ->
	addLinkToBasket(info['linkUrl'])


###
 * Callback of "add current page to basket" menu entry
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
###
addCurrentPageToBasketMenuCallback = (info, tab) ->
	addLinkToBasket(info.pageUrl);


###
 * Callback of "get debrid link" menu entry
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
###
getDebridLinkMenuCallback = (info, tab) ->
	linkUrl = info['linkUrl'].trim()
	debridLink( [ linkUrl ], false )

###
 * Callback of "get debrid link for current page" menu entry
 * @param  info Array of info on current link
 * @param  tab  Array of info on current tab
###
getDebridLinkCurrentPage = (info, tab) ->
	currentPageUrl = info.pageUrl.trim()
	debridLink( [ currentPageUrl ], false )


chrome.contextMenus.removeAll();

titleEntry = chrome.i18n.getMessage('context_menu_download_menu')
chrome.contextMenus.create({"title": titleEntry, "contexts":["link"], "onclick": downloadNowMenuCallback})

titleEntry = chrome.i18n.getMessage('context_menu_get_debrided_link')
chrome.contextMenus.create({"title": titleEntry, "contexts":["link"], "onclick": getDebridLinkMenuCallback})

titleEntry = chrome.i18n.getMessage('context_menu_add_basket')
chrome.contextMenus.create({"title": titleEntry, "contexts":["link"], "onclick": addToBasketMenuCallback})

titleEntry = chrome.i18n.getMessage('context_menu_download_basket')
chrome.contextMenus.create({"title": titleEntry, "contexts":["all"], "onclick": downloadAllBasket})

chrome.contextMenus.create({type: "separator", "contexts":["all"]});

titleEntry = chrome.i18n.getMessage('context_menu_download_current_page')
chrome.contextMenus.create({title: titleEntry, "contexts":["all"], "onclick": downloadNowCurrentPageMenuCallback})

titleEntry = chrome.i18n.getMessage('context_menu_debrid_current_page')
chrome.contextMenus.create({"title": titleEntry, "contexts":["all"], "onclick": getDebridLinkCurrentPage})

titleEntry = chrome.i18n.getMessage('context_menu_add_current_page_basket')
chrome.contextMenus.create({"title": titleEntry, "contexts":["all"], "onclick": addCurrentPageToBasketMenuCallback})
