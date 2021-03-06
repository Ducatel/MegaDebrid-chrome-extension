###
# Debrid links
# @param  array of links you want to debrid
# @param autoDownload If true download the debrided link, false copy the link
###
window.debridLink = (links, autoDownload) ->
	chrome.storage.sync.get({ token: 'token' }, (items) ->
		if chrome.runtime.lastError
			displayNotification(chrome.i18n.getMessage("no_account_error"), true);
			return

		api_url = "http://www.mega-debrid.eu/api.php?action=getLink&token=" + items.token;

		for link in linksTodebrid
			xhr = new XMLHttpRequest()
			try
				xhr.onreadystatechange = () ->
					if xhr.readyState == 4 and (xhr.status == 200 or xhr.status == 0)
						jsonResponse = JSON.parse(xhr.responseText)
						console.log(jsonResponse);
						if jsonResponse['response_code'] == "ok"
							newLink = jsonResponse['debridLink'].trim().slice(1, -1)
							if autoDownload then chrome.downloads.download({url :newLink}) else copyToClipboard(newLink)
						else if jsonResponse['response_code'] == 'TOKEN_ERROR'
							reLogin(()->debridLink(link, autoDownload))
							return
						else
							displayNotification(chrome.i18n.getMessage('undefined_error_debird_link') + "\n" + link , true)

				xhr.onerror = (error) -> console.error(error)

				xhr.open("POST", api_url, true)
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
				xhr.send("link=" + link)

			catch err
				console.error(err)

	)


##
# relog the user and call the callback method after
# @param  callback The callback you want to call if authentification with success
##
window.reLogin = (callback) ->
	console.log(callback)

	chrome.storage.sync.get({login: 'login',password: 'password'}, (items) ->

		login = items.login;
		password = items.password;
		xhr = new XMLHttpRequest;

		try

			xhr.onreadystatechange = () ->

				if xhr.readyState == 4 and (xhr.status == 200 or xhr.status == 0)

					jsonResponse = JSON.parse(xhr.responseText);
					if jsonResponse["response_code"].trim() == "ok"
						chrome.storage.sync.set({'token': jsonResponse["token"] }, callback)
					else
						printAPIError(jsonResponse);



			xhr.onerror = (error) -> console.error(error)

			url = "http://www.mega-debrid.eu/api.php?action=connectUser";
			url += "&login=" + encodeURIComponent(login);
			url += "&password=" + encodeURIComponent(password);

			xhr.open("GET", url, false);
			xhr.send(null);

		catch err
			console.error(err)
	)


###
# Copy variable to clipboard
# @param text The value you want to copy in the clipboard
###
window.copyToClipboard = ( text ) ->
	copyDiv = document.createElement('div');
	copyDiv.contentEditable = true;
	document.body.appendChild(copyDiv);
	copyDiv.innerHTML = text;
	copyDiv.unselectable = "off";
	copyDiv.focus();
	document.execCommand('SelectAll');
	document.execCommand("Copy", false, null);
	document.body.removeChild(copyDiv);
	displayNotification(chrome.i18n.getMessage('url_copied_in_clipboard'));

###
# Display a notification
# @param  msg The message you want to display
# @param isError If true display a notification for error else standard notification. Default value: false
###
window.displayNotification = (msg, isError) ->

	isError = if typeof isError isnt 'undefined' then isError else false

	opt = { type: "basic",  title: "Mega-Debrid", message: msg }

	if isError
		opt['iconUrl'] = chrome.extension.getURL("img/errorIcon.png")
		opt['eventTime'] = Date.now() + 15000
	else
		opt['iconUrl'] = chrome.extension.getURL("img/icon128.png")
		opt['eventTime'] = Date.now() + 3000

	chrome.notifications.create("", opt,(notificationId) -> return)


###
# Dowload all links in basket
# @param callback function called at the end
###
window.downloadAllBasket = (callback) ->

	chrome.storage.local.get( { linksTodebrid: 'linksTodebrid' }, (items) ->

		listOfLinks = items.linksTodebrid
		if  Object.prototype.toString.call( listOfLinks ) == '[object Array]'
			debridLink( listOfLinks , true )
			if typeof callback is 'function'
				chrome.storage.local.remove('linksTodebrid', callback)
			else
				chrome.storage.local.remove('linksTodebrid')
	)
