var builder = require('botbuilder');
var Logger = require('../logger/logger');
var ReadData = require('../readData/ReadData');
let data = ReadData.read('./readData/input.dat');
var google = require('../google/googleConnection');
var CalendarUtil = require('../util/CalendarUtil');
var spreadsheetId = process.env.G_SPREADSHEET_ID;

var Button = require('../view/Button');
var Menu = require('../view/Menu');
var Day = require('../view/Day');
var DayFactory = require('../view/DayFactory');
class OrderFoodDialog {

    constructor() {
        Logger.logger().info("Creating OrderFood Intent");
        this.dialogs = [
            OrderFoodDialog.fetchMenu,
            OrderFoodDialog.askUserForMeal,
            OrderFoodDialog.handleUserReplayOnMenuNotUpToDate,
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

                session.endDialog();
                /*------------------------*/
            }
        ];
    }

    static askUserForMeal(session, results, next) {
        let day = DayFactory.buildDay(session,session.dialogData.sheet.getDayByDate(new Date()));
        builder.Prompts.choice(session, day.msg, day.choises);
    }

    static isMenuUpToDate(session, results, next) {
        Logger.logger().info("Checking update date");
        google.fetchUpdateDate(session, next, spreadsheetId, OrderFoodDialog.onMenuFetched);
    }

    static onMenuFetched(session, next, menuDate) {
        session.dialogData.updateDate = menuDate;
        Logger.logger().info('Menu Date %s', menuDate);
        var nextFriday = CalendarUtil.getNextFriday(menuDate);
        Logger.logger().info('Next Friday %s', nextFriday);
        var today = new Date(new Date().getYear(), new Date().getMonth(), new Date().getDate());
        Logger.logger().info('Today: %s', today);
        if (menuDate <= today && today < nextFriday) {
            OrderFoodDialog.handleMenuUpToDate(session, next);
        } else {
            OrderFoodDialog.handleMenuNotUpToDate(session);
        }
    }

    static handleMenuNotUpToDate(session, next) {
        Logger.logger().info('Update date is OK!');
        session.dialogData.upToDate = true;
        next();
    }

    static handleMenuUpToDate(session) {
        Logger.logger().warn('Update date is not in interval!');
        session.dialogData.upToDate = false;
        session.send("Seems that the lunch list was not updated yet");
        builder.Prompts.confirm(session, "Are you sure you wish to order anyway?");
    }

    static handleUserReplayOnMenuNotUpToDate(session, results, next) {
        if (!OrderFoodDialog.isMenuUpToDate(session)) {
            Logger.logger().info("User chose '%s'", results.response);
            if (results.response) {
                next();
            } else {
                Logger.logger().info('OrderFoodDialog ended.');
                session.endDialog();
            }
        } else {
            next();
        }
    }

    static isMenuUpToDate(session) {
        return session.dialogData.upToDate;
    }



    static fetchMenu(session, results, next) {
        Logger.logger().info("Gather all data from Lunch List");
        google.fetchMenu(session, results, next, spreadsheetId, OrderFoodDialog.onMenuReceived);
    }

    static onMenuReceived(session, results, next, sheet) {
        //create Model
        // save(session,days,false);
        //add Model to Session
        session.dialogData.sheet = sheet;
        next();
    }


    get dialog() {
        return this.dialogs;
    }

    static name() {
        return "/orderfood";
    }

    static match() {
        return /^!orderfood/i;
    }

}
module.exports = OrderFoodDialog;