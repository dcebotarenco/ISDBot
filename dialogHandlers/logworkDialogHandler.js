/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var builder = require('botbuilder');
var Logger = require('../logger/logger');
class LogWorkDialog
{
    constructor()
    {
        Logger.logger().info("Creating LogWork Intent");
        this.dialogs = [
            function (session, results, next) {
                LogWorkDialog.prototype.logSession(session);
                var text = session.message.text;
                var matchResult = text.match(LogWorkDialog.match());
                if (matchResult[1] !== undefined && matchResult[2] !== undefined)
                {
                    let tracker = matchResult[1];
                    let date = matchResult[2];
                    let issue = matchResult[3];
                    let logtime = matchResult[4];
                    Logger.logger().info("Issue[%s] and time[%s]", issue, logtime);
                } else
                {
                    Logger.logger().info("Issue and time were NOT inserted");
                    next();
                }
            },
            function (session, results, next) {
                LogWorkDialog.prototype.logSession(session);
                builder.Prompts.choice(session, "Where", "Time Tracker|Jira", {listStyle: builder.ListStyle["button"]});
            },
            function (session, results, next) {
                session.dialogData.where = results.response.entity;
                LogWorkDialog.prototype.logSession(session);

                Logger.logger().info("User selected [%s]", session.dialogData.where);
                builder.Prompts.choice(session, "When", "Today|Other Date", {listStyle: builder.ListStyle["button"]});
            },
            function (session, results, next) {

                session.dialogData.when = results.response.entity;
                LogWorkDialog.prototype.logSession(session);

                Logger.logger().info("User selected [%s]", session.dialogData.when);
                if (session.dialogData.when === "Other Date")
                {
                    builder.Prompts.time(session, "What date would you like to log?", {
                        retryPrompt: "Sorry Bastard, Wrong date.. Try something like: 2 June, 1 February 2015"
                    });
                } else
                {
                    Logger.logger().info("No need to ask for date");
                    next();
                }

            },
            function (session, results, next) {
                if (session.dialogData.when !== "Today")
                {
                    Logger.logger().info("User was asked for a date");
                    var time = builder.EntityRecognizer.resolveTime([results.response]);
                    session.dialogData.date = time;
                    LogWorkDialog.prototype.logSession(session);
                }
                next();
            }
        ];
    }

    logSession(session)
    {
        Logger.logger().info("Where[%s]", session.dialogData.where);
        Logger.logger().info("When[%s]", session.dialogData.when);
        Logger.logger().info("Date[%s]", session.dialogData.date);
    }

    get dialog()
    {
        return this.dialogs;
    }

    static name()
    {
        return "/logwork";
    }

    static match()
    {
        return /^(!logwork\s+(\w+|\w+\-\d+)\s+(\d{1,2}\.\d{1}))|(!logwork)/i;
    }

}
module.exports = LogWorkDialog;

