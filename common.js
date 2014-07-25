
/**
 * Debrid links
 * @param  array of links you want to debrid
 * @return 
 */
function debridLink(links){

	chrome.storage.sync.get(
	{ token: 'token' }, 
	function(items) {

		var API_URL = "https://www.mega-debrid.eu/api.php?action=getLink&token=" + items.token;

		for(var i = 0 ; i < links.length ; i++){

			var link = links[i];
			var xhr = new XMLHttpRequest();
			try {

				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

						var jsonResponse = JSON.parse(xhr.responseText);
						console.log(jsonResponse);
					}
				}

				xhr.onerror = function(error) {	console.error(error);	}			

				xhr.open("POST", API_URL, false);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send("link=" + link);
				
			} catch(e) { console.error(e); }
		}
	});

}