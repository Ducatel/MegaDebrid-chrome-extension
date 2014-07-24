function printAPIError(jsonResponse){

	var msg = chrome.i18n.getMessage('options_login_fail') + "\n";
	if(jsonResponse["response_code"].trim() == "BANNED_ACCOUNT")
		msg += jsonResponse["banned_reason"];
	else if (jsonResponse["response_code"].trim() == "UNKNOWN_USER")
		msg += jsonResponse["response_text"];
	
	alert(msg);

}


/**
 * Check if the credential are valid
 * @param  login   The login
 * @param  password The password
 * @return true if valid
 */
function checkCredential(login, password){

	var xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
				var jsonResponse = JSON.parse(xhr.responseText);
				if(jsonResponse["response_code"].trim() == "ok"){
					return true;
				}
				else{
					printAPIError(jsonResponse);
					return false;
				}
            }
            else
            	return false;
            
        }
        xhr.onerror = function(error) {
            console.error(error);
            return false;
        }

        var url = "https://www.mega-debrid.eu/api.php?action=connectUser";
        url += "&login=" + encodeURIComponent(login);
        url += "&password=" + encodeURIComponent(password);

        xhr.open("GET", url, false);
        xhr.send(null);
    } catch(e) {
        console.error(e);
        return false;
    }
}

/**
 * Save options to chrome storage
 */
function save_options() {
	var login = document.getElementById('login').value;
	var password = document.getElementById('password').value;

	if( checkCredential(login, password) ){

		chrome.storage.sync.set({'login': login, 'password' : password }, function() {
			alert(chrome.i18n.getMessage('options_save_complete'));
			
		});
	}

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