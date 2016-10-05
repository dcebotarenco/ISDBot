/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var botbuilder = require('botbuilder');
var RootIntent = require('../dialogHandlers/rootDialogHandler.js');
var OrderFoodDialog = require('../dialogHandlers/orderFoodDialogHandler.js');
var Logger = require('../logger/logger');
var Cron = require('node-cron');

class SkypeBot
{
    constructor()
    {
        Logger.logger().info("Creating Bot");
        this.APP_ID = process.env.MICROSOFT_APP_ID;
        this.PSW = process.env.MICROSOFT_APP_PASSWORD;
        this.botConnection = new botbuilder.ChatConnector({
            appId: this.APP_ID,
            appPassword: this.PSW
        });
        this.bot = new botbuilder.UniversalBot(this.botConnection);

        this.bot.on('conversationUpdate', function (message) {
            // Check for group conversations
            if (message.address.conversation.isGroup) {
                // Send a hello message when bot is added
                if (message.membersAdded) {
                    message.membersAdded.forEach(function (identity) {
                        if (identity.id === message.address.bot.id) {
                            var reply = new builder.Message()
                                .address(message.address)
                                .text("Hello everyone!");
                            this.send(reply);
                        }
                    });
                }

                // Send a goodbye message when bot is removed
                if (message.membersRemoved) {
                    message.membersRemoved.forEach(function (identity) {
                        if (identity.id === message.address.bot.id) {
                            var reply = new botbuilder.Message()
                                .address(message.address)
                                .text("Goodbye");
                            this.send(reply);
                        }
                    });
                }
            }
        });

        this.bot.on('contactRelationUpdate', function (message) {
            if (message.action === 'add') {
                var name = message.user ? message.user.name : null;
                var reply = new botbuilder.Message()
                    .address(message.address)
                    .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
                this.send(reply);
            } else {
                // delete their data
            }
        });

        this.bot.on('deleteUserData', function (message) {
            // User asked to delete their data
        });


        // Install First Run middleware and dialog
        this.bot.use({botbuilder: function (session, next) {
                Logger.logger().info("Message receive[%s]", session.message.text);
                    next();
                }
        });
        Logger.logger().info("Adding Dialogs");
        this.rootIntent = new RootIntent();
        this.orderfood = new OrderFoodDialog();
        
        this.bot.dialog(RootIntent.name(), this.rootIntent.intent);
        this.bot.dialog(OrderFoodDialog.name(), this.orderfood.dialog);
        this.bot.dialog('/a',function(session){
            session.endDialog("Hello");
        })


        Cron.schedule('* */1 * * *', function(a,b)
        {
            Logger.logger().info("Test " + a + b);
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
            // this.bot.beginDialog(address, OrderFoodDialog.name());
        }.bind(null,"a","c"));

        var address =
        {
            bot: {
                id:'ISD',
                name:'ISD'
            },
            channelId: "emulator",
            user: {
                id:'inther_d',
                name:'inther_d'
            },
            id:'service_url_id',
            serviceUrl: "http://localhost:9000",
            useAuth:true
        }
        this.bot.beginDialog(address, '/a');

    }
    get connection()
    {
        return this.botConnection;
    }
    set connection(connection)
    {
        this.botConnection = connection;
    }

}
module.exports = SkypeBot;
