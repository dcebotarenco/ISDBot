var builder = require('botbuilder');
var Logger = require('../logger/logger');
var ReadData = require('../readData/ReadData');
let data = ReadData.read('./readData/input.dat');
var google = require('../google/googleConnection');
var spreadsheetId = process.env.G_SPREADSHEET_ID;
class OrderFoodDialog
{

    constructor()
    {
        Logger.logger().info("Creating OrderFood Intent");
        this.dialogs = [
            function (session, results, next) {
                Logger.logger().info("Checking update date");
                google.fetchUpdateDate(spreadsheetId, checkUpdateDate);
                function checkUpdateDate(date) {
                    ///
                    var a = date.split('.');
                    var updateDate = new Date(a[2], a[1] - 1, a[0]);//using a[1]-1 since Date object has month from 0-11
                    var today = new Date();
                    var lastDay;
                    updateDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);//we don't need hours
                    session.dialogData.updateDate = updateDate;//will be used later
                    Logger.logger().info('Update Date %s', updateDate);
                    Logger.logger().info('Today: %s', today);
                    lastDay = new Date(updateDate.getTime());
                    lastDay.setDate(lastDay.getDate() + 5);
                    Logger.logger().info('Last Day: %s', lastDay);
                    if (updateDate <= today && today < lastDay) {
                        Logger.logger().info('Update date is OK!');
                        session.dialogData.upToDate = true;
                        next();
                    } else {
                        Logger.logger().warn('Update date is not in interval!');
                        session.dialogData.upToDate = false;
                        session.send("Seems that the lunch list was not updated yet");
                        builder.Prompts.confirm(session, "Are you sure you wish to order anyway?");
                    }
                }
            },
            function (session, results, next) {
                if (!session.dialogData.upToDate) {
                    Logger.logger().info("User chose '%s'", results.response ? 'yes' : 'no');
                    if (results.response) {
                        next();
                    } else {
                        Logger.logger().info('OrderFoodDialog ended.');
                        session.endDialog();
                    }
                } else {
                    next();
                }
            },
            function (session, results, next) {
                Logger.logger().info("Gather all data from Lunch List");
                google.fetchDataPerWeekDay(spreadsheetId, showMenu);
                function showMenu(rows) {
                    if (rows.length == 0) {
                        Logger.logger().warn('No data found');
                        session.endDialog('There is a problem with reading data from Lunch List');
                    } else {
                        session.dialogData.rows = rows;
                        var monday = new Array();
                        var tuesday = new Array();
                        var wednesday = new Array();
                        var thursday = new Array();
                        var friday = new Array();

                        for (var range = 0; range < rows.length; range++) {
                            for (var menuItem = 0; menuItem < rows[range].values[0].length; menuItem++) {
                                if (range < 4) {
                                    monday.push(rows[range].values[0][menuItem]);
                                }
                                if (range >= 4 && range < 8) {
                                    tuesday.push(rows[range].values[0][menuItem]);
                                }
                                if (range >= 8 && range < 12) {
                                    wednesday.push(rows[range].values[0][menuItem]);
                                }
                                if (range >= 12 && range < 16) {
                                    thursday.push(rows[range].values[0][menuItem]);
                                }
                                if (range >= 16 && range < 20) {
                                    friday.push(rows[range].values[0][menuItem]);
                                }
                            }
                        }
                        session.dialogData.monday = monday.toString();
                        session.dialogData.tuesday = tuesday.toString();
                        session.dialogData.wednesday = wednesday.toString();
                        session.dialogData.thursday = thursday.toString();
                        session.dialogData.friday = friday.toString();

                        /*PER WEEKDAY*/
                        /*for(var range=0; range < rows.length; range++){
                         for(var menuItem=0; menuItem< rows[range].values[0].length; menuItem++){
                         Logger.logger().info(rows[range].values[0][menuItem]);
                         }
                         }*/
                        /*PER MENU*/
                        /*for (var range = 0; range < rows.length; range++) {
                         for (var weekday = 0; weekday < rows[range].values.length; weekday++) {
                         for (var menuItem = 0; menuItem < rows[range].values[weekday].length; menuItem++) {
                         Logger.logger().info(rows[range].values[weekday][menuItem]);
                         }
                         }
                         }*/
                        next();
                    }
                }

            },
            function (session, results, next) {
                Logger.logger().info("Show data as carusel");
                var rows = session.dialogData.rows;
                var monday = session.dialogData.monday;
                var tuesday = session.dialogData.tuesday;
                var wednesday = session.dialogData.wednesday;
                var thursday = session.dialogData.thursday;
                var friday = session.dialogData.friday;
                // Ask the user to select an item from a carousel.
                var msg = new builder.Message(session)
                        .textFormat(builder.TextFormat.markdown)
                        .attachmentLayout(builder.AttachmentLayout.carousel)
                        .attachments([
                            new builder.HeroCard(session)
                                    .title(new Date())
                                    .text(monday)
                                    .buttons([
                                        builder.CardAction.imBack(session, "mo-1S", "1S"),
                                        builder.CardAction.imBack(session, "mo-2S", "2S"),
                                        builder.CardAction.imBack(session, "mo-3S", "3S"),
                                        builder.CardAction.imBack(session, "mo-4S", "4S"),
                                        builder.CardAction.imBack(session, "mo-1M", "1M"),
                                        builder.CardAction.imBack(session, "mo-2M", "2M"),
                                        builder.CardAction.imBack(session, "mo-3M", "3M"),
                                        builder.CardAction.imBack(session, "mo-4M", "4M")

                                    ]),
                            new builder.HeroCard(session)
                                    .title(new Date())
                                    .text(tuesday)
                                    .buttons([
                                        builder.CardAction.imBack(session, "tu-1S", "1S"),
                                        builder.CardAction.imBack(session, "tu-2S", "2S"),
                                        builder.CardAction.imBack(session, "tu-3S", "3S"),
                                        builder.CardAction.imBack(session, "tu-4S", "4S"),
                                        builder.CardAction.imBack(session, "tu-1M", "1M"),
                                        builder.CardAction.imBack(session, "tu-2M", "2M"),
                                        builder.CardAction.imBack(session, "tu-3M", "3M"),
                                        builder.CardAction.imBack(session, "tu-4M", "4M")

                                    ]),
                            new builder.HeroCard(session)
                                    .title(new Date())
                                    .text(wednesday)
                                    .buttons([
                                        builder.CardAction.imBack(session, "we-1S", "1S"),
                                        builder.CardAction.imBack(session, "we-2S", "2S"),
                                        builder.CardAction.imBack(session, "we-3S", "3S"),
                                        builder.CardAction.imBack(session, "we-4S", "4S"),
                                        builder.CardAction.imBack(session, "we-1M", "1M"),
                                        builder.CardAction.imBack(session, "we-2M", "2M"),
                                        builder.CardAction.imBack(session, "we-3M", "3M"),
                                        builder.CardAction.imBack(session, "we-4M", "4M")

                                    ]),
                            new builder.HeroCard(session)
                                    .title(new Date())
                                    .text(thursday)
                                    .buttons([
                                        builder.CardAction.imBack(session, "th-1S", "1S"),
                                        builder.CardAction.imBack(session, "th-2S", "2S"),
                                        builder.CardAction.imBack(session, "th-3S", "3S"),
                                        builder.CardAction.imBack(session, "th-4S", "4S"),
                                        builder.CardAction.imBack(session, "th-1M", "1M"),
                                        builder.CardAction.imBack(session, "th-2M", "2M"),
                                        builder.CardAction.imBack(session, "th-3M", "3M"),
                                        builder.CardAction.imBack(session, "th-4M", "4M")

                                    ]),
                            new builder.HeroCard(session)
                                    .title(new Date())
                                    .text(friday)
                                    .buttons([
                                        builder.CardAction.imBack(session, "fr-1S", "1S"),
                                        builder.CardAction.imBack(session, "fr-2S", "2S"),
                                        builder.CardAction.imBack(session, "fr-3S", "3S"),
                                        builder.CardAction.imBack(session, "fr-4S", "4S"),
                                        builder.CardAction.imBack(session, "fr-1M", "1M"),
                                        builder.CardAction.imBack(session, "fr-2M", "2M"),
                                        builder.CardAction.imBack(session, "fr-3M", "3M"),
                                        builder.CardAction.imBack(session, "fr-4M", "4M")

                                    ])
                        ]);
                builder.Prompts.choice(session, msg, "mo-1S|mo-2S|mo-3S|mo-4S|mo-1M|mo-2M|mo-3M|mo-4M|tu-1S|tu-2S|tu-3S|tu-4S|tu-1M|tu-2M|tu-3M|tu-4M|we-1S|we-2S|we-3S|we-4S|we-1M|we-2M|we-3M|we-4M|th-1S|th-2S|th-3S|th-4S|th-1M|th-2M|th-3M|th-4M|fr-1S|fr-2S|fr-3S|fr-4S|fr-1M|fr-2M|fr-3M|fr-4M");
            },
            function (session, results, next) {
                var weekDay, selectedMenu;
                var kvPair = results.response.entity.split('-');
                switch (kvPair[0]) {
                    case 'mo':
                        weekDay = 0;
                        break;
                    case 'tu':
                        weekDay = 1;
                        break;
                    case 'we':
                        weekDay = 2;
                        break;
                    case 'th':
                        weekDay = 3;
                        break;
                    case 'fr':
                        weekDay = 4;
                        break;
                }
                switch (kvPair[1]) {
                    case '1S':
                        selectedMenu = "1S";
                        break;
                    case '2S':
                        selectedMenu = "2S";
                        break;
                    case '3S':
                        selectedMenu = "3S";
                        break;
                    case '4S':
                        selectedMenu = "4S";
                        break;
                    case '1M':
                        selectedMenu = "1M";
                        break;
                    case '2M':
                        selectedMenu = "2M";
                        break;
                    case '3M':
                        selectedMenu = "3M";
                        break;
                    case '4M':
                        selectedMenu = "4M";
                        break;
                }
//                session.send('You selected %s %s', weekDay, selectedMenu);
                session.dialogData.selectedMenu = selectedMenu;
                session.dialogData.weekDay = weekDay;
                

                next();
            },
            function (session, results, next) {
                Logger.logger().info("write to file");
                Logger.logger().info("User[%s], weekDay[%s], selectedMenu[%s]", session.message.address.user.name, session.dialogData.weekDay, session.dialogData.selectedMenu);
                /*to continue*/
                
                session.endDialog();/*------------------------*/
            }
        ];
    }

    get dialog()
    {
        return this.dialogs;
    }

    static name()
    {
        return "/orderfood";
    }

    static match()
    {
        return /^!orderfood/i;
    }

}
module.exports = OrderFoodDialog;