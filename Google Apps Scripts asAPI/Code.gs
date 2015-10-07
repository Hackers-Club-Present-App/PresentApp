function run() {
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://api.fitbit.com/1/user/-/profile.json';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
}



function myFunction() {
  var myData = SpreadsheetApp.openById('1exDso7tOBRCB-lcZ3AIGcmZ4ViIoKhE8NkmXVXyq6qA').getSheetByName('Stuff').getDataRange().getValues();
  Logger.log(myData);


}


function getService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return OAuth2.createService('drive')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId('61682783874-vbvrae1ffhhctociqd2v0o7pje3qmvvb.apps.googleusercontent.com')
      .setClientSecret('K4pInoegz_YkIiMvSIVzLh2X')

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('myFunction')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request (space-separated for Google services).
      .setScope('https://www.googleapis.com/auth/script.external_request https://www.googleapis.com/auth/script.storage https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email')

      // Below are Google-specific OAuth2 parameters.

      // Sets the login hint, which will prevent the account chooser screen
      // from being shown to users logged in with multiple accounts.
      .setParam('login_hint', Session.getActiveUser().getEmail())

      // Requests offline access.
      .setParam('access_type', 'offline')

      // Forces the approval prompt every time. This is useful for testing,
      // but not desirable in a production application.
      .setParam('approval_prompt', 'force');
}

function showSidebar() {
  var driveService = getDriveService();
  if (!driveService.hasAccess()) {
    var authorizationUrl = driveService.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Reopen the sidebar when the authorization is complete.');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
    DocumentApp.getUi().showSidebar(page);
  } else {
   Logger.log('else');
  }
}

function authCallback(request) {
  var driveService = getDriveService();
  var isAuthorized = driveService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}


function makeRequest() {
  var driveService = getDriveService();
  var response = UrlFetchApp.fetch('https://www.googleapis.com/drive/v2/files?maxResults=10', {
    headers: {
      Authorization: 'Bearer ' + driveService.getAccessToken()
    }
  });

}
