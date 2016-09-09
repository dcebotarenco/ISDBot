var Rest = require('./rest/rest.js');
var SkypeBot = require('./skypebot/skypebot.js');
var Logger = require('./logger/logger');
var Jira = require('./jira/Jira');

Logger.logger().info("Starting App");
let restServer = new Rest();
restServer.startServer(process.env.PORT);
restServer.attachBot(new SkypeBot(),"/api/messages");

var jira = new Jira();
