/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var restify = require('restify');

class Rest
{
    constructor() {}
    startServer(port)
    {
        this.rest_server = restify.createServer();
        this.rest_server.listen(port, function () {
            console.log("Rest Server started on %s", port);
        });
    }

    attachBot(bot, path)
    {
        this.rest_server.post(path, bot.connection.listen());
    }
}
module.exports = Rest;

