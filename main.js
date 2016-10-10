var Rest = require('./rest/rest.js');
var SkypeBot = require('./skypebot/skypebot.js');
var Logger = require('./logger/logger');
var GoogleConnection = require('./google/googleConnection.js');
var ModelBuilder = require('./modelBuilder/ModelBuilder.js');
var Cron = require('node-cron');

Logger.logger().info("Starting App");
GoogleConnection.fetchBotSettings((response)=>function (rows) {
    let settings = ModelBuilder.createBotSettings(rows);
    let restServer = new Rest();
    restServer.startServer(process.env.PORT);
    let skypeBot = new SkypeBot(settings);
    restServer.attachBot(skypeBot, "/api/messages");
    Cron.schedule(settings.getValueByKey('cron_updateSettings'), function (skypeBot) {
        GoogleConnection.fetchBotSettings((response) => function (rows) {
            let settings = ModelBuilder.createBotSettings(rows);
            skypeBot.updateSettings(settings);
        }(response.values));
    }.bind(null, skypeBot));
}(response.values));


