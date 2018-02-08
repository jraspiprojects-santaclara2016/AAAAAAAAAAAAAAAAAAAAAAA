const fs = require('fs');
const winston = require('winston');

exports.run = () => {
    //define directory where the logs are located
    const logDir = 'logs';
    //define environment
    const env = process.env.NODE_ENV || 'development';
    //define timestamp format
    const tsFormat = () => (new Date()).toLocaleTimeString();
    // Create the log directory if it does not exist
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    //winston configuration
    const logger = new (winston.Logger)({
        transports: [
            // colorize the output to the console
            new (winston.transports.Console)({
                colorize: true,
                timestamp: tsFormat,
                level: env === 'development' ? 'debug' : 'info'
            }),
            new (require('winston-daily-rotate-file'))({
                filename: `${logDir}/-results.log`,
                timestamp: tsFormat,
                datePattern: 'yyyy-MM-dd',
                prepend: true,
                level: env === 'development' ? 'debug' : 'info'
            })
        ]
    });

    return logger;
};