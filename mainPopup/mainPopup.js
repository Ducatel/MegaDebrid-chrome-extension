
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
		var baseContent = tbody.innerHTML;

		var linkTableContent = "";
		for(var i = 0 ; i < listOfLinks.length ; i++){
			var link = listOfLinks[i];

			var tableRow = "<tr id='row_" + i + "'><td>";
			//tableRow += "<img class='deleteButton' src='../img/cross.png' onclick='deleteRow(\'" + i + "\');' />";
			tableRow += "<img class='deleteButton' src='../img/cross.png' id='deleteButton_" + i +"'/>";
			tableRow += "</td><td colspan='2'>" + link + "</td></tr>";
			
			linkTableContent += tableRow;
		}
		tbody.innerHTML = linkTableContent + baseContent;

		for(var i = 0 ; i < listOfLinks.length ; i++){
			var row = document.getElementById("deleteButton_" + i);
			row.onclick = function() { deleteRow(i); };
		}

			

	});
}


function deleteRow(rowId){
	//var row = document.getElementById("row_" + rowId);
	//row.parentNode.removeChild(row);
	alert(rowId);

}

window.addEventListener("load", function() {
	loadBasket();
});