var Rest = require('./rest/rest.js');
var SkypeBot = require('./skypebot/skypebot.js');

let restServer = new Rest();
restServer.startServer(process.env.PORT);
restServer.attachBot(new SkypeBot(),"/api/messages");
