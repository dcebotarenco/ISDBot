/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var builder = require('botbuilder');
class LogWorkDialog
{
    constructor()
    {
        this.dialogs = [
            function (session) {
                builder.Prompts.text(session, 'Hi! What is your name?');
            },
            function (session, results) {
                session.userData.name = results.response;
                session.endDialog();
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
        return /^!logwork/i;
    }

}
module.exports = LogWorkDialog;

