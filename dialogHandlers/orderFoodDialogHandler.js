var builder = require('botbuilder');
var Logger = require('../logger/logger');
var ReadData = require('../readData/ReadData');
let data = ReadData.read('./readData/input.dat');
//class LogWorkDialog
class OrderFoodDialog
{

    constructor()
    {
        Logger.logger().info("Creating OrderFood Intent");
        this.dialogs = [
            function (session, results, next) {
                var text = session.message.text;
                var matchResult = text.match(OrderFoodDialog.match());
                if (matchResult !== undefined)
                {
                    data.forEach(function (value) {
                        session.send(value);
                    });
//                    builder.Prompts.choice(session, "Pick an option", "1M|2M|3M|4M");
                    builder.Prompts.choice(session, "Pick an option", "1M|2M|3M|4M", {listStyle: builder.ListStyle["button"]});
//                    next();
                }
            },
            function (session, results, next) {
                session.userData.order = results.response.entity;
                Logger.logger().info("You have chosen [%s]", session.userData.order);
                session.endDialog(`You have chosen ${session.userData.order}`);  
            }
        ];
    }

    get dialog()
    {
        return this.dialogs;
    }

    static name()
    {
        return "/orderfood";
    }

    static match()
    {
        return /^!orderfood/i;
    }

}
module.exports = OrderFoodDialog;