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
var Logger = require('../logger/logger');
var Cron = require('node-cron');

class SkypeBot {
    constructor() {
        Logger.logger().info("Creating Bot");
        this.APP_ID = process.env.MICROSOFT_APP_ID;
        this.PSW = process.env.MICROSOFT_APP_PASSWORD;
        this.botConnection = new botbuilder.ChatConnector({
            appId: this.APP_ID,
            appPassword: this.PSW
        });
        this.bot = new botbuilder.UniversalBot(this.botConnection);

        this.bot.on('contactRelationUpdate', SkypeBot.onBotAddedInContacts);

        // Install First Run middleware and dialog
        this.bot.use({botbuilder: SkypeBot.proxy});

        this.rootIntent = new RootIntent();
        this.orderfood = new OrderFoodDialog();
        this.greetingDialog = new GreetingDialog();
        this.helpDialog = new HelpDialog();

        this.bot.dialog(RootIntent.name(), this.rootIntent.intent);
        this.bot.dialog(OrderFoodDialog.name(), this.orderfood.dialog);
        this.bot.dialog(GreetingDialog.name(), this.greetingDialog.dialog);
        this.bot.dialog(HelpDialog.name(), this.helpDialog.dialog);

        Cron.schedule('*/10 * * * * *', function (bot) {
            bot.beginOrderfoodDialogForUser('29:1piNRAb1_qeQ42IRJEOk5TDpXUMl8_Sn0WZuiN8EUKga9RC3ytjuSxT4vX-Qdokan','DAN');
        }.bind(null, this));

        // var address =
        // {
        //     bot: {
        //         id:'ISD',
        //         name:'ISD'
        //     },
        //     channelId: "emulator",
        //     user: {
        //         id:'inther_d',
        //         name:'inther_d'
        //     },
        //     id:'service_url_id',
        //     serviceUrl: "http://localhost:9000",
        //     useAuth:true
        // }
        //this.bot.beginDialog(address, '/a');

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

    beginOrderfoodDialogForUser(userId, userName) {
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
            serviceUrl: "http://localhost:9000",
            useAuth: true
        }
        this.bot.beginDialog(address, OrderFoodDialog.name());
    }

}
module.exports = SkypeBot;
