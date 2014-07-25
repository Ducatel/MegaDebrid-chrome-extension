
/**
 * Debrid links
 * @param  array of links you want to debrid
 */
function debridLink(links){

	chrome.storage.sync.get(
	{ token: 'token' }, 
	function(items) {

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
							console.log(newLink)
							window.open(newLink); 
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
	});

}