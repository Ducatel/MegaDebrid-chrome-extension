
###
# Load the content of the basket
###
loadBasket = () ->
	chrome.storage.local.get( { linksTodebrid: 'linksTodebrid' }, (items) ->
		listOfLinks = items.linksTodebrid;
		if  Object.prototype.toString.call( listOfLinks ) isnt '[object Array]'
			listOfLinks = Array();

		tbody = document.getElementById('listOfLinkTableBody');

		linkTableContent = "";
		for link, index in listOfLinks
			tableRow = "<tr id='row_#{index}'><td>";
			tableRow += "<img class='deleteButton' src='../img/cross.png' id='deleteButton_#{index}'/>";
			tableRow += "</td><td colspan='2' class='linkUrl'>#{reduceDisplayedLink(link)}</td></tr>";
			linkTableContent += tableRow;


		tbody.innerHTML = linkTableContent;

		for link, index in listOfLinks
			row = document.getElementById("deleteButton_#{index}");
			row.onclick = (index) -> deleteRow(index)
	)


###
# Reduce the length of link
# @param  link The link you want to minimize
# @return the minimized link or the input link if the size is correct
###
reduceDisplayedLink = (link) ->
	if link.length  <= 83 then return link
	return link[0..80] + "..."


###
# Delete a link from basket and memeory
# @param  rowId The row id where user has clicked
###
deleteRow = (rowId) ->

	chrome.storage.local.get( { linksTodebrid: 'linksTodebrid' }, (items) ->
			listOfLinks = items.linksTodebrid;

			newListOfLinks = Array();
			for link, index in listOfLinks
					if(index != rowId)
						newListOfLinks.push(link);

			chrome.storage.local.set({'linksTodebrid': newListOfLinks}, loadBasket)

	)


###
# Donwload all links in basket and redraw the popup
###
downloadAllLinks = () ->
	downloadAllBasket(loadBasket)


window.addEventListener("load", () ->
	loadBasket()
	document.getElementById('saveButton').onclick = downloadAllLinks
)
