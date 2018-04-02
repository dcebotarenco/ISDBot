/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var log4js = require('log4js');
var fs = require('fs');

var initialized = false;
var logger;

class Logger
{
    static _init()
    {
        logger = log4js.getLogger('main');
        logger.setLevel('INFO');
        logger.trace('Test Trace...');
        logger.debug('Test Debug...');
        logger.info('Test Info...');
        logger.warn('Test Warn...');
        logger.error('Test Error...');
        logger.fatal('Test Fatal...');
        logger.info('Logger Initialized...');
    }

    static logger()
    {
        if (!initialized)
        {
            this._init();
            initialized = true;
        }
        return logger;
    }
}
module.exports = Logger;
