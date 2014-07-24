/*******************************************************************/
/** This script is use for display a translated ressource in HTML **/
/*******************************************************************/


window.addEventListener("load", function() {
	var translatableObject = document.getElementsByClassName('translatable');
	for(var i = 0; i < translatableObject.length; i++) {
		if (translatableObject[i].dataset && translatableObject[i].dataset.message) {
			var message = chrome.i18n.getMessage(translatableObject[i].dataset.message);
			if(translatableObject[i].tagName.toLowerCase() == "input")
				translatableObject[i].value = message;
			else
				translatableObject[i].innerHTML = message;
		}
	}
});


