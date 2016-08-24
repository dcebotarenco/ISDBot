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
                var text = session.message.text;
                var matchResult = text.match(LogWorkDialog.match());
                if (matchResult[1] !== undefined && matchResult[2] !== undefined)
                {
                    let issue = matchResult[1];
                    let time = matchResult[2];
                    Logger.logger().info("Issue[%s] and time[%s]", issue, time);
                } else
                {
                    Logger.logger().info("Issue and time were NOT inserted");
                    next();
                }
            },
            function (session, results, next) {
                builder.Prompts.choice(session, "Which color?", "Time Tracker|Jira");
            }
        ];
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

