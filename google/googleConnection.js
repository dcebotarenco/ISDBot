var google = require('googleapis');
var Logger = require('../logger/logger');
var gserviceaccount = process.env.G_SERVICE_ACCOUNT;
var googleKeyPem = process.env.G_KEY_PEM;
class GoogleConnection
{
    constructor() {}
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

    static selectMenu(spreadsheetId) {
        var sheets = google.sheets('v4');

        sheets.spreadsheets.values.update({
            auth: this.getConnection(),
            spreadsheetId: spreadsheetId,
            range: 'currentMonth!Z19',
            valueInputOption: "RAW",
            resource: {
                /*to be changed*/
                values: [["4s"]]
            }
        }, function (err, response) {
            if (err) {
                Logger.logger().error('The API returned an error: ' + err);
                return;
            }
            Logger.logger().info("spreadsheetId = %s",response.spreadsheetId);
            Logger.logger().info("updatedRange=%s",response.updatedRange);
            Logger.logger().info("updatedRows=%s",response.updatedRows);
            Logger.logger().info("updatedColumns=%s",response.updatedColumns);
            Logger.logger().info("updatedCells=%s",response.updatedCells);
        });
    }

    static fetchDataPerWeekDay(spreadsheetId, callback) {
        var sheets = google.sheets('v4');

        sheets.spreadsheets.values.batchGet({
            auth: this.getConnection(),
            spreadsheetId: spreadsheetId,
            ranges: ['lunchList!B5:B7', 'lunchList!B10:B12', 'lunchList!B15:B17', 'lunchList!B20:B22', 'lunchList!C5:C7', 'lunchList!C10:C12', 'lunchList!C15:C17', 'lunchList!C20:C22', 'lunchList!D5:D7', 'lunchList!D10:D12', 'lunchList!D15:D17', 'lunchList!D20:D22', 'lunchList!E5:E7', 'lunchList!E10:E12', 'lunchList!E15:E17', 'lunchList!E20:E22', 'lunchList!F5:F7', 'lunchList!F10:F12', 'lunchList!F15:F17', 'lunchList!F20:F22'],
            majorDimension: "COLUMNS"
        }, function (err, response) {
            if (err) {
                Logger.logger().error('The API returned an error: ' + err);
                return;
            }
            var rows = response.valueRanges;
            if (rows.length == 0) {
                Logger.logger().warn('There is a problem with reading data from Lunch List');
                callback(rows);
            }
            callback(rows);
        });
    }

    /* static fetchDataPerMenu(spreadsheetId, callback) {
     var sheets = google.sheets('v4');
     
     sheets.spreadsheets.values.batchGet({
     auth: this.getConnection(),
     spreadsheetId: spreadsheetId,
     //            ranges: ['lunchList!B5:F7', 'lunchList!B10:F12'],
     ranges: ['lunchList!B5:F7', 'lunchList!B10:F12', 'lunchList!B15:F17', 'lunchList!B20:F22'],
     majorDimension: "COLUMNS"
     }, function (err, response) {
     if (err) {
     Logger.logger().error('The API returned an error: ' + err);
     return;
     }
     var rows = response.valueRanges;
     if (rows.length == 0) {
     Logger.logger().warn('There is a problem with reading data from Lunch List');
     callback(rows);
     } 
     callback(rows);
     });
     }*/



    static fetchUpdateDate(spreadsheetId, callback) {
        var sheets = google.sheets('v4');
        sheets.spreadsheets.values.get({
            auth: this.getConnection(),
            spreadsheetId: spreadsheetId,
            range: 'lunchList!B1',
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var rows = response.values;
            if (rows.length == 0) {
                console.log('No data found.');
            } else {
                var cell = rows[0][0];
                console.log(`Fetched update date: ${cell}`);
                callback(cell);
            }
        });
    }
    
        static fetchAllSheetCells(spreadsheetId, sheetName, callback) {
        var sheets = google.sheets('v4');
        sheets.spreadsheets.values.get({
            auth: this.getConnection(),
            spreadsheetId: spreadsheetId,
            range: sheetName,
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var rows = response.values;
            if (rows.length == 0) {
                console.log('No data found.');
            } else {
                callback(rows);
            }
        });
    }
}
module.exports = GoogleConnection;