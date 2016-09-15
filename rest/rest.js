/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var restify = require('restify');
var Logger = require('../logger/logger.js');
class Rest
{
    constructor() {}
    startServer(port)
    {
        this.rest_server = restify.createServer();
        this.rest_server.listen(port, function () {
            Logger.logger().info("Rest Server started on %s", port);
        });
    }

    attachBot(bot, path)
    {
        Logger.logger().info("Bot attached on [%s]", path);
        this.rest_server.post(path, bot.connection.listen());
    }
}
module.exports = Rest;
