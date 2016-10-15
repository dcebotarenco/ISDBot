/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');
var RootIntent = require('../dialogHandlers/RootIntent.js');
var OrderFoodDialog = require('../dialogHandlers/OrderFoodDialog.js');
var GreetingDialog = require('../dialogHandlers/GreetingDialog.js');
var HelpDialog = require('../dialogHandlers/HelpDialog.js');
var PlaceOrderDialog = require('../dialogHandlers/PlaceOrderDialog.js');
var GoogleConnection = require('../google/googleConnection.js');
var ModelBuilder = require('../modelBuilder/ModelBuilder.js');
var Logger = require('../logger/logger');
var Cron = require('node-cron');

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
        this.bot.on('contactRelationUpdate', SkypeBot.onBotAddedInContacts);
        this.bot.use({botbuilder: SkypeBot.proxy});
        this.bot.dialog(RootIntent.name(), new RootIntent().intent);
        this.bot.dialog(OrderFoodDialog.name(), new OrderFoodDialog().dialog);
        this.bot.dialog(GreetingDialog.name(), new GreetingDialog().dialog);
        this.bot.dialog(HelpDialog.name(), new HelpDialog().dialog);
        this.bot.dialog(PlaceOrderDialog.name(), new PlaceOrderDialog().dialog);

        // GoogleConnection.updateValue('C', 10, 'test2', 'bot_settings', function () {});

        this._initOrderFoodCron();
        this._initUpdateMenuCron();
    }

    _initOrderFoodCron() {
        let orderFoodCron = this.settings.getValueByKey('cron_orderFood');
        Logger.logger().info("Creating order food cron at [%s]", orderFoodCron);
        Cron.schedule(orderFoodCron, function (bot) {
            Logger.logger().info("Running order food cron");
            GoogleConnection.fetchRegisteredEmployees((response) => function (bot, rows) {
                ModelBuilder.createRegisteredEmployees(rows).forEach(function (employee) {
                    if (employee.id) {
                        Logger.logger().info("Send begin dialog[%s] to user[%s] with id[%s]", OrderFoodDialog.name(), employee.name, employee.id);
                        bot.beginDialogForUser(bot.settings.getValueByKey('service_url'), employee.id, employee.name, OrderFoodDialog.name());
                    }
                    else {
                        Logger.logger().info('Cannot send begin dialog [%s] because user[%s] is not registered, id is missing', OrderFoodDialog.name(), employee.name);
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
            this._initUpdateCron();
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
        next();
    }

    beginDialogForUser(serviceUrl, userId, userName, dialog) {
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
            useAuth: true
        };
        this.bot.beginDialog(address, dialog);
    }

}
module.exports = SkypeBot;
