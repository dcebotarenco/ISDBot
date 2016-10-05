var google = require('googleapis');
var Logger = require('../logger/logger');
var gserviceaccount = process.env.G_SERVICE_ACCOUNT;
var googleKeyPem = process.env.G_KEY_PEM;

class GoogleConnection {
  constructor() {
  }

  static getConnection() {
    var jwtClient = new google.auth.JWT(
            gserviceaccount,
            null,
            googleKeyPem,
            ['https://www.googleapis.com/auth/spreadsheets']
            );

    jwtClient.authorize(function (err, tokens) {
      if (err) {
        Logger.logger().error(err);
        return;
      } else {
        Logger.logger().info("Successfully connected!");
      }
    });
    return jwtClient;
  }
    static fetchGoogleSheet(session, results, next, spreadsheetId, sheetName, majorDimension, callback) {
        var sheets = google.sheets('v4');

        sheets.spreadsheets.values.get({
            auth: this.getConnection(),
            spreadsheetId: spreadsheetId,
            range: sheetName,
            majorDimension: majorDimension
        }, function (err, response) {
            if (err) {
                Logger.logger().error('The API returned an error: ' + err);
                return;
            }
            callback(session, results, next, response.values)
        });
    }
}
module.exports = GoogleConnection;