/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');
var RootIntent = require('../dialogHandlers/RootIntent');
var OrderFoodDialog = require('../dialogHandlers/OrderFoodDialog');
var GreetingDialog = require('../dialogHandlers/GreetingDialog');
var HelpDialog = require('../dialogHandlers/HelpDialog');
var PlaceOrderDialog = require('../dialogHandlers/PlaceOrderDialog');
var CancelOrderDialog = require('../dialogHandlers/CancelOrderDialog');
var UserChoisesStatusDialog = require('../dialogHandlers/UserChoisesStatusDialog');
var JokeDialog = require('../dialogHandlers/JokeDialog');
var BooksDialog = require('../dialogHandlers/BooksDialog');
var GoogleConnection = require('../google/googleConnection');
var ModelBuilder = require('../modelBuilder/ModelBuilder');
var NotificationDialog = require('../dialogHandlers/NotificationDialog');
var SendMessageToUser = require('../dialogHandlers/SendMessageToUser');
var Logger = require('../logger/logger');
var Cron = require('node-cron');
var moment = require('moment');
var CalendarUtil = require('../util/CalendarUtil');
var SheetUtil = require('../util/SheetUtil');

class SkypeBot {
    constructor(settings) {
        this._settings = settings;
        Logger.logger().info("Creating Bot");
        this.APP_ID = process.env.MICROSOFT_APP_ID;
        this.PSW = process.env.MICROSOFT_APP_PASSWORD;
        this.botConnection = new botbuilder.ChatConnector({
            appId: this.APP_ID,
            appPassword: this.PSW
        });
        this.bot = new botbuilder.UniversalBot(this.botConnection);
        this.bot.on('error', function (error) {
            Logger.logger().error("Proxy Caught ERROR[%s] [%s] ", error.message, error.stack);
        });
        this.bot.on('contactRelationUpdate', SkypeBot.onBotAddedInContacts);
        this.bot.use({botbuilder: SkypeBot.proxy});
        this.bot.dialog(RootIntent.name(), new RootIntent().intent);
        this.bot.dialog(OrderFoodDialog.name(), new OrderFoodDialog().dialog);
        this.bot.dialog(GreetingDialog.name(), new GreetingDialog().dialog);
        this.bot.dialog(HelpDialog.name(), new HelpDialog().dialog);
        this.bot.dialog(PlaceOrderDialog.name(), new PlaceOrderDialog().dialog);
        this.bot.dialog(CancelOrderDialog.name(), new CancelOrderDialog().dialog);
        this.bot.dialog(UserChoisesStatusDialog.name(), new UserChoisesStatusDialog().dialog);
        this.bot.dialog(JokeDialog.name(), new JokeDialog(this._settings).dialog);
        this.bot.dialog(BooksDialog.name(), new BooksDialog().dialog);
        this.bot.dialog(NotificationDialog.name(), new NotificationDialog().dialog);
        this.bot.dialog(SendMessageToUser.name(), new SendMessageToUser().dialog);

        this._initOrderFoodCron();
        this._initStartOrderFoodAgain();
        this._initOrderFoodStatusCron();
        this._initUpdateMenuCron();
        this._initJokesCron();
    }

    _initOrderFoodCron() {
        let orderFoodCron = this.settings.getValueByKey('cron_orderFood');
        Logger.logger().info("Creating order food cron at [%s]", orderFoodCron);
        Cron.schedule(orderFoodCron, function (bot) {
            Logger.logger().info("Running order food cron");
            var month = new Date().toLocaleString("en-us", {month: "long"});
            var year = new Date().getFullYear();
            var choiceSheetName = month + " " + year;
            GoogleConnection.fetchRegisteredEmployees((response) => function (bot, response) {
                let employeeList = ModelBuilder.createRegisteredEmployees(response.values);
                GoogleConnection.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, choiceSheetName, 'ROWS', (response) => function (bot, response, employeeList) {
                    let choicesSheet = ModelBuilder.createChoiceModelSheet(response.values, employeeList);
                    choicesSheet.employees.forEach(function (user) {
                        let employee = employeeList.filter(function (emp) {
                            return emp.id === user.id;
                        });
                        //checking if food notifications are turned on for this user
                        if (employee[0].notifications.foodNotification == 'YES') {
                            let todayChoices = user.getChoicesByDate(new Date());
                            let emptyChoices = todayChoices.choices.filter(function (choice) {
                                return choice.choiceMenuName.length === 0 && choice.choiceMenuNumber.length === 0;
                            });
                            if (todayChoices.choices.length - emptyChoices.length === 0) {
                                Logger.logger().info("User[%s] haven't made choice for today. Asking him for food", user.fullName);
                                Logger.logger().info("Send begin dialog[%s] to user[%s] with id[%s]", OrderFoodDialog.name(), user.skypeName, user.id);
                                bot.beginDialogForUser(bot.settings.getValueByKey('service_url'), user.id, user.skypeName, OrderFoodDialog.name(), PlaceOrderDialog.name());
                            }
                            else {
                                Logger.logger().info("User[%s] has at least one choice for today, skipping asking him today for food", user.fullName);
                            }
                        } else {
                            Logger.logger().info('Food notifications are turned off for user[%s]', user.fullName);
                        }
                    });

                }(bot, response, employeeList));
            }(bot, response));
        }.bind(null, this));
    }

    _initOrderFoodStatusCron() {
        let orderFoodStatusCron = this.settings.getValueByKey('cron_orderFoodStatus');
        Logger.logger().info("Creating order food status cron at [%s]", orderFoodStatusCron);
        Cron.schedule(orderFoodStatusCron, function (bot) {
            Logger.logger().info("Running order food status cron");
            var month = new Date().toLocaleString("en-us", {month: "long"});
            var year = new Date().getFullYear();
            var choiceSheetName = month + " " + year;
            GoogleConnection.fetchRegisteredEmployees((response) => function (bot, response) {
                let employeeList = ModelBuilder.createRegisteredEmployees(response.values);
                GoogleConnection.fetchGoogleSheet(process.env.G_SPREADSHEET_ID, choiceSheetName, 'ROWS', (response) => function (bot, response, employeeList) {
                    let choicesSheet = ModelBuilder.createChoiceModelSheet(response.values, employeeList);
                    choicesSheet.employees.forEach(function (user) {
                        let employee = employeeList.filter(function (emp) {
                            return emp.id === user.id;
                        });
                        //checking if food notifications are turned on for this user
                        if (employee[0].notifications.foodNotification == 'YES') {
                            let todayChoices = user.getChoicesByDate(new Date());
                            let emptyChoices = todayChoices.choices.filter(function (choice) {
                                return choice.choiceMenuName.length === 0 && choice.choiceMenuNumber.length === 0;
                            });
                            if (emptyChoices.length !== todayChoices.choices.length) {
                                Logger.logger().info("User[%s] has at least one choice for today. Sending food status dialog", user.fullName);
                                Logger.logger().info("Send begin dialog[%s] to user[%s] with id[%s]", UserChoisesStatusDialog.name(), user.skypeName, user.id);
                                // session.userData.orderActionDate = moment(new Date());
                                bot.beginDialogForUser(bot.settings.getValueByKey('service_url'), user.id, user.skypeName, OrderFoodDialog.name(), UserChoisesStatusDialog.name());
                            }
                            else {
                                Logger.logger().info('There are not choices for user [%s] and date[%s]', user.fullName, moment(new Date()).format("YYYY-MM-DD"));
                            }
                        } else {
                            Logger.logger().info('Food notifications are turned off for user[%s]', user.fullName);
                        }
                    });

                }(bot, response, employeeList));
            }(bot, response));
        }.bind(null, this));
    }

    _initJokesCron() {
        let jokes_cron = this.settings.getValueByKey('cron_jokes');
        Logger.logger().info("Creating jokes cron at [%s]", jokes_cron);
        Cron.schedule(jokes_cron, function (bot) {
            Logger.logger().info("Running jokes cron");
            GoogleConnection.fetchRegisteredEmployees((response) => function (bot, rows) {
                ModelBuilder.createRegisteredEmployees(rows).forEach(function (user) {
                    if (user.id) {
                        //checking if joke notifications are turned on for this user
                        if (user.notifications.jokeNotification == 'YES') {
                            Logger.logger().info("Send begin dialog[%s] to user[%s] with id[%s]", JokeDialog.name(), user.name, user.id);
                            bot.beginDialogForUser(bot.settings.getValueByKey('service_url'), user.id, user.name, JokeDialog.name());
                        }
                        else {
                            Logger.logger().info('Joke notifications are turned off for user[%s]', user.name);
                        }
                    }
                    else {
                        Logger.logger().info('Cannot send begin dialog [%s] because user[%s] is not registered, id is missing', JokeDialog.name(), user.name);
                    }
                });
            }(bot, response.values));
        }.bind(null, this));
    }

    _initStartOrderFoodAgain() {
        let foodNotificationColumnNumber = 6; //TODO: find a way to get this dynamically
        let startDateColumnNumber = 7; //TODO: find a way to get this dynamically
        let foodNotificationColumnLetter = SheetUtil.columnToLetter(foodNotificationColumnNumber);
        let startDateColumnLetter = SheetUtil.columnToLetter(startDateColumnNumber);
        let SheetName = 'BotUsers';
        let foodNotificationValueToWrite = 'YES';
        let startOrderFoodAgainCron = this.settings.getValueByKey('cron_startOrderFoodAgain');
        Logger.logger().info("Creating startOrderFoodAgain cron at [%s]", startOrderFoodAgainCron);
        Cron.schedule(startOrderFoodAgainCron, function (bot) {
            Logger.logger().info("Running startOrderFoodAgain cron");
            GoogleConnection.fetchRegisteredEmployees((response) => function (bot, rows) {
                ModelBuilder.createRegisteredEmployees(rows).forEach(function (user) {
                    if (user.id) {
                        Logger.logger().info('Checking user [%s] with start date [%s].', user.name, user.notifications.startDate);
                        //if food notification is turned off and StartDate is today, then turn on food notification
                        if (CalendarUtil.isValidDate(user.notifications.startDate)) {
                            let pattern = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;
                            let startDate = null;
                            var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                            today.setHours(0,0,0,0);//we need to compare date without time
                            Logger.logger().info('Today: [%s]', today);
                            startDate = new Date(user.notifications.startDate.replace(pattern, '$3-$2-$1'));
                            startDate.setHours(0,0,0,0);//we need to compare date without time
                            Logger.logger().info('Start Date: %s', startDate);
                            if (user.notifications.foodNotification == 'NO' && today.getDate() === startDate.getDate()) {
                                Logger.logger().info('Food notification needs to be turned on.');
                                GoogleConnection.updateValue(foodNotificationColumnLetter,user.rowNumber, foodNotificationValueToWrite, SheetName, (response, err, value)=>function (response, err, value) {
                                    if (err) {
                                        Logger.logger().error('The API returned an error: ' + err);
                                    }
                                    else {
                                        Logger.logger().info('Range[%s] updated with value[%s] for user [%s]', response.updatedRange, value, user.name);
                                    }
                                }(response, err, value));
                                GoogleConnection.updateValue(startDateColumnLetter, user.rowNumber, '', SheetName, (response, err, value)=>function (response, err, value) {
                                    if (err) {
                                        Logger.logger().error('The API returned an error: ' + err);
                                    }
                                    else {
                                        Logger.logger().info('Range[%s] updated with value[%s] for user [%s]', response.updatedRange, value, user.name);
                                    }
                                }(response, err, value));

                                bot.beginDialogForUser(bot.settings.getValueByKey('service_url'), user.id, user.skypeName, SendMessageToUser.name(), 'Did you miss me? I know you did ;) ... i\'m gonna send you food notifications again (noworries)');
                            }
                            else if (user.notifications.foodNotification == 'NO' && today.getDate() < startDate.getDate()) {
                                Logger.logger().info('Food notification is going to be turned on2 [%s]' ,startDate.getDate()+'.'+(startDate.getMonth()+1)+'.'+startDate.getFullYear() );
                            }else if (user.notifications.foodNotification == 'YES') {
                                Logger.logger().info('Food notification is already on for user [%s]', user.name);
                            }else{
                                Logger.logger().info('Start Date [%s] is in the past, no further action needed', startDate);
                            }
                        } else {
                            Logger.logger().warn('Invalid date:  [%s]', user.notifications.startDate);
                        }
                    }
                    else {
                        Logger.logger().info('Cannot send begin dialog [%s] because user[%s] is not registered, id is missing', JokeDialog.name(), user.name);
                    }
                });
            }(bot, response.values));
        }.bind(null, this));
    }

    _initUpdateMenuCron() {
        let updateMenuCron = this.settings.getValueByKey('cron_updateMenu');
        Logger.logger().info("Creating update menu cron at [%s]", updateMenuCron);
        Cron.schedule(updateMenuCron, function (bot) {
            Logger.logger().info('Send begin dialog update menu to administrators');
            let firstAdminId = bot.settings.getValueByKey('first_menu_administrator');
            let secondMenuId = bot.settings.getValueByKey('second_menu_administrator');
            bot.beginDialogForUser(bot.settings.getValueByKey('service_url'), firstAdminId, '', OrderFoodDialog.name());
            bot.beginDialogForUser(bot.settings.getValueByKey('service_url'), secondMenuId, '', OrderFoodDialog.name());
        }.bind(null, this));
    }

    _isOrderFoodCronTheSame(newSettings) {
        return this.settings.getValueByKey('cron_orderFood') === newSettings.getValueByKey('cron_orderFood');
    }

    _isUpdateMenuCronTheSame(newSettings) {
        return this.settings.getValueByKey('cron_updateMenu') === newSettings.getValueByKey('cron_updateMenu');
    }

    _isJokeCronTheSame(newSettings) {
        return this.settings.getValueByKey('cron_jokes') === newSettings.getValueByKey('cron_jokes');
    }

    get settings() {
        return this._settings;
    }

    updateSettings(newSettings) {
        this._settings = newSettings;
        if (!this._isOrderFoodCronTheSame(newSettings)) {
            Logger.logger().info("Order food cron is not the same");
            this._initOrderFoodCron();
        }
        if (!this._isUpdateMenuCronTheSame(newSettings)) {
            Logger.logger().info("Update menu cron is not the same");
            this._initUpdateMenuCron();
        }
        if (!this._isJokeCronTheSame(newSettings)) {
            Logger.logger().info("Update menu cron is not the same");
            this._initJokesCron();
        }
    }


    get connection() {
        return this.botConnection;
    }

    set connection(connection) {
        this.botConnection = connection;
    }

    static onBotAddedInContacts(message) {
        if (message.action === 'add') {
            this.beginDialog(message.address, GreetingDialog.name());
            this.beginDialog(message.address, HelpDialog.name());
        }
    }

    static proxy(session, next) {
        Logger.logger().info("Message received[%s][%s][%s][%s][%s]", session.message.text,
            session.message.address.serviceUrl,
            session.message.address.channelId,
            session.message.address.bot.name,
            session.message.address.user.name,
            session.message.address.user.id,
            session.message.address.useAuth);
        if (session.message.text === "bye") {
            session.endConversation("Bye ;)");
        }
        else {
            next();
        }
    }

    beginDialogForUser(serviceUrl, userId, userName, dialogToGetDataFrom, dialogToStart) {
        var address =
            {
                bot: {
                    id: 'ISD',
                    name: 'ISD'
                },
                channelId: 'skype',
                user: {
                    id: userId,
                    name: userName
                },
                id: 'service_url_id',
                serviceUrl: serviceUrl,
                useAuth: true,
                conversation: {
                    id: userId
                }
            };
        this.bot.beginDialog(address, dialogToGetDataFrom, dialogToStart);
    }

    /**
     * This method sends a message to user in case there is no session available. The downside is that it doesn't ends current active dialog if there is any.
     * @param serviceUrl
     * @param userId
     * @param userName
     * @param msg
     */
    sendMessageWithoutSession(serviceUrl, userId, userName, msg) {
        var address =
            {
                bot: {
                    id: 'ISD',
                    name: 'ISD'
                },
                channelId: 'skype',
                user: {
                    id: userId,
                    name: userName
                },
                id: 'service_url_id',
                serviceUrl: serviceUrl,
                useAuth: true,
                conversation: {
                    id: userId
                }
            };
        let message = new botbuilder.Message()
            .text(msg)
            .address(address);

        this.bot.send(message, (err) => {
            if (err) {
                Logger.logger().warn('Error when sending messages with universalBot:  [%s]', err);
            }
        });
    }

    static getEmployeeById(id, employeeList) {
        return employeeList.filter(function (emp) {
            return emp.id === id;
        });
    }

}
module.exports = SkypeBot;
