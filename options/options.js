
/**
 * Display an alert box for display the error
 * @param   jsonResponse json API response
 */
function printAPIError(jsonResponse){

	var msg = chrome.i18n.getMessage('options_login_fail') + "\n";
	if(jsonResponse != undefined){
		if(jsonResponse["response_code"].trim() == "BANNED_ACCOUNT")
			msg += jsonResponse["banned_reason"];
		else if (jsonResponse["response_code"].trim() == "UNKNOWN_USER")
			msg += jsonResponse["response_text"];
	}
	alert(msg);

}

/**
 * Check if the credential are valid and
 * if is valid, save the login/password/token
 * @param  login   The login
 * @param  password The password
 */
function saveCredential(login, password){

	var xhr = new XMLHttpRequest();
	try {

		xhr.onreadystatechange = function(){

			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

				var jsonResponse = JSON.parse(xhr.responseText);
				alert(jsonResponse);
				if( jsonResponse["response_code"].trim() == "ok" ){

					chrome.storage.sync.set({'login': login, 'password' : password, 'token': jsonResponse["token"] }, function() {
						alert(chrome.i18n.getMessage('options_save_complete'));
					});
				}
				else
					printAPIError(jsonResponse);
			}
			else{
			printAPIError(undefined);
			console.log(xhr);
			 }
		}

		xhr.onerror = function(error) {	console.error(error);	alert(error);}

		var url = "http://www.mega-debrid.eu/api.php?action=connectUser";
		url += "&login=" + encodeURIComponent(login);
		url += "&password=" + encodeURIComponent(password);

		xhr.open("GET", url, false);
		xhr.send(null);
		
	} catch(e) { console.error(e); }
}

/**
 * Save options to chrome storage
 */
function save_options() {
	var login = document.getElementById('login').value;
	var password = document.getElementById('password').value;
	saveCredential(login, password);
}

/**
 * Restore the option value
 */
function restore_options() {
	chrome.storage.sync.get(
	{
		login: 'login',
		password: 'password'
	}, 
	function(items) {
		document.getElementById('login').value = items.login;
		document.getElementById('password').value= items.password;
	});
}


window.addEventListener("load", function() {

	restore_options();
	document.getElementById('save').addEventListener('click', save_options);

});