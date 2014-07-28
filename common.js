
/**
 * Debrid links
 * @param  array of links you want to debrid
 * @param autoDownload If true download the debrided link, false copy the link
 */
function debridLink(links, autoDownload){

	chrome.storage.sync.get(
	{ token: 'token' }, 
	function(items) {

		if(chrome.runtime.lastError){
			displayNotification(chrome.i18n.getMessage("no_account_error"), true);
			return;
		}

		var api_url = "https://www.mega-debrid.eu/api.php?action=getLink&token=" + items.token;

		for(var i = 0 ; i < links.length ; i++){

			var link = links[i];
			var xhr = new XMLHttpRequest();
			try {

				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

						var jsonResponse = JSON.parse(xhr.responseText);
						if (jsonResponse['response_code'] == "ok"){
							
							var newLink = jsonResponse['debridLink'].trim().slice(1, -1);
							if(autoDownload)
								window.open(newLink); 
							else
								copyToClipboard(newLink);
						}
						else{
							displayNotification(chrome.i18n.getMessage('undefined_error_debird_link') + "\n" + link , true);
						}
					}
				}

				xhr.onerror = function(error) {	console.error(error); }			

				xhr.open("POST", api_url, true);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send("link=" + link);
			
			} catch(e) { console.error(e); }
		}
	});

}

/**
 * Copy variable to clipboard
 * @param text The value you want to copy in the clipboard
 */
function copyToClipboard( text ){
	var copyDiv = document.createElement('div');
	copyDiv.contentEditable = true;
	document.body.appendChild(copyDiv);
	copyDiv.innerHTML = text;
	copyDiv.unselectable = "off";
	copyDiv.focus();
	document.execCommand('SelectAll');
	document.execCommand("Copy", false, null);
	document.body.removeChild(copyDiv);
	displayNotification(chrome.i18n.getMessage('url_copied_in_clipboard'));
}

/**
 * Display a notification
 * @param  msg The message you want to display
 * @param isError If true display a notification for error else standard notification. Default value: false
 */
function displayNotification(msg, isError){

	isError = (typeof isError !== 'undefined') ? isError : false;

	var opt = { type: "basic",  title: "Mega-Debrid", message: msg }

	if(isError){
		opt['iconUrl'] = chrome.extension.getURL("img/errorIcon.png");
		opt['eventTime'] = Date.now() + 15000;
	}
	else{
		opt['iconUrl'] = chrome.extension.getURL("img/icon128.png");
		opt['eventTime'] = Date.now() + 3000;
	}

	chrome.notifications.create("", opt,function(notificationId) { });
}