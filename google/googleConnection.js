var google = require('googleapis');
var Logger = require('../logger/logger');
class GoogleConnection
{
    constructor() {}
    static getConnection() {
        var jwtClient = new google.auth.JWT(
                'test@developer.gserviceaccount.com',
                'key.pem',
                null,
                ['https://www.googleapis.com/auth/spreadsheets.readonly']
                );

        jwtClient.authorize(function (err, tokens) {
            if (err) {
                Logger.Logger.error(err);
                return;
            }else{
                Logger.logger().info("Successfully connected!");
            }
        });
        return jwtClient;
    }
}
module.exports = GoogleConnection;