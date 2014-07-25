
/**
 * Debrid links
 * @param  array of links you want to debrid
 * @param autoDownload If true download the debrided link, false copy the link
 */
function debridLink(links, autoDownload){

	chrome.storage.sync.get(
	{ token: 'token' }, 
	function(items) {

		if(items.token != "token"){

			var api_url = "https://www.mega-debrid.eu/api.php?action=getLink&token=" + items.token;

			for(var i = 0 ; i < links.length ; i++){

				var link = links[i];
				var xhr = new XMLHttpRequest();
				try {

					xhr.onreadystatechange = function(){
						if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

							var jsonResponse = JSON.parse(xhr.responseText);
							console.log(jsonResponse);

							if (jsonResponse['response_code'] == "ok"){
								
								var newLink = jsonResponse['debridLink'].trim().slice(1, -1);
								console.log(newLink);
								if(autoDownload)
									window.open(newLink); 
								else
									copyToClipboard(newLink);
							}
							else{
								alert(chrome.i18n.getMessage('undefined_error_debird_link'));
							}
						}
					}

					xhr.onerror = function(error) {	console.error(error); }			

					xhr.open("POST", api_url, true);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					xhr.send("link=" + link);
				
				} catch(e) { console.error(e); }
			}
		}
		else{
			alert(chrome.i18n.getMessage("no_account_error"));
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
}