
###
# Display an notification for display the error
# @param   jsonResponse json API response
###
printAPIError = (jsonResponse) ->

    msg = chrome.i18n.getMessage('options_login_fail') + "\n"
    if jsonResponse != undefined
        if jsonResponse["response_code"].trim() == "BANNED_ACCOUNT"
            msg += " - " + jsonResponse["banned_reason"]
        else if jsonResponse["response_code"].trim() == "UNKNOWN_USER"
            msg += " - " + jsonResponse["response_text"]
    displayNotification(msg, true)


###
# Check if the credential are valid and
# if is valid, save the login/password/token
# @param  login   The login
# @param  password The password
###
saveCredential = (login, password) ->

  xhr = new XMLHttpRequest
  try

    xhr.onreadystatechange = () ->

      if xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)

        jsonResponse = JSON.parse(xhr.responseText);
        console.log("[DEBUG] saveCredential:");
        console.log(jsonResponse);

        if jsonResponse["response_code"].trim() == "ok"

          chrome.storage.sync.set({'login': login, 'password' : password, 'token': jsonResponse["token"] }, () ->
            displayNotification(chrome.i18n.getMessage('options_save_complete'))
          )
        else
          printAPIError(jsonResponse)

    xhr.onerror = (error) -> console.error(error)

    url = "http://www.mega-debrid.eu/api.php?action=connectUser";
    url += "&login=" + encodeURIComponent(login);
    url += "&password=" + encodeURIComponent(password);

    xhr.open("GET", url, false);
    xhr.send(null);

  catch e
    console.error(e)


###
# Save options to chrome storage
###
save_options = () ->
  login = document.getElementById('login').value
  password = document.getElementById('password').value
  saveCredential(login, password)


###
# Restore the option value
###
restore_options = () ->
  chrome.storage.sync.get( {login: 'login', password: 'password' },(items) ->
    document.getElementById('login').value = items.login;
    document.getElementById('password').value= items.password;
  )


###
# Launch the save_options function if event are keyup on enter key
# @param  e event
###
launchSave_options = (e) ->
  e = e || window.event;
  if e.keyCode == '13' then  save_options()



window.addEventListener("load", () ->

  restore_options()
  document.getElementById('save').addEventListener('click', save_options)

  document.getElementById('login').onkeyup = launchSave_options
  document.getElementById('password').onkeyup = launchSave_options
)
