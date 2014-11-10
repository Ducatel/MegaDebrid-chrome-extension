#####################################################################
### This script is use for display a translated ressource in HTML ###
#####################################################################


window.addEventListener("load", () ->
	translatableObject = document.getElementsByClassName('translatable')
	for transObj in translatableObject
		if transObj.dataset and transObj.dataset.message
			message = chrome.i18n.getMessage(transObj.dataset.message)
			if transObj.tagName.toLowerCase() == "input"
				transObj.value = message;
			else
				transObj.innerHTML = message;
		
	)

