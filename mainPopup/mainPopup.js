
/**
 * Load the content of the basket
 */
function loadBasket(){
	chrome.storage.sync.get( { linksTodebrid: 'linksTodebrid' }, 
	function(items) {
		var listOfLinks = items.linksTodebrid;
		if( Object.prototype.toString.call( listOfLinks ) !== '[object Array]' ) 
			listOfLinks = Array();

		var tbody = document.getElementById('listOfLinkTableBody');

		var linkTableContent = "";
		for(var i = 0 ; i < listOfLinks.length ; i++){
			var link = listOfLinks[i];

			var tableRow = "<tr id='row_" + i + "'><td>";
			tableRow += "<img class='deleteButton' src='../img/cross.png' id='deleteButton_" + i +"'/>";
			tableRow += "</td><td colspan='2' class='linkUrl'>" + reduceDisplayedLink(link) + "</td></tr>";
			
			linkTableContent += tableRow;
		}
		
		tbody.innerHTML = linkTableContent;

		for(var i = 0 ; i < listOfLinks.length ; i++){
			var row = document.getElementById("deleteButton_" + i);
			row.onclick = (function() { var iClosure = i; return function() { deleteRow(iClosure);}; })();
		}
	});
}

/**
 * Reduce the length of link
 * @param  link The link you want to minimize
 * @return the minimized link or the input link if the size is correct
 */
function reduceDisplayedLink(link){
	if(link.length  <= 83)
		return link;

	return link.substr(0,80) + "...";
}

/**
 * Delete a link from basket and memeory
 * @param  rowId The row id where user has clicked
 */
function deleteRow(rowId){

	chrome.storage.sync.get( { linksTodebrid: 'linksTodebrid' }, 
		function(items) {
			var listOfLinks = items.linksTodebrid;

			var newListOfLinks = Array();
			for(var i = 0 ; i < listOfLinks.length ; i++)
					if(i != rowId)
						newListOfLinks.push(listOfLinks[i]);
			
			chrome.storage.sync.set({'linksTodebrid': newListOfLinks}, loadBasket);
		}
	);
}

/**
 * Dowload all links in basket
 */
function downloadAllBasket(){
	chrome.storage.sync.get( { linksTodebrid: 'linksTodebrid' }, 
		function(items) {

			var listOfLinks = items.linksTodebrid;
			if( Object.prototype.toString.call( listOfLinks ) !== '[object Array]' ) 
				return;

			debridLink( listOfLinks , true );
			chrome.storage.sync.set({'linksTodebrid': []}, loadBasket);
		}
	);
}

window.addEventListener("load", function() {
	loadBasket();
	document.getElementById('saveButton').onclick = downloadAllBasket;
});