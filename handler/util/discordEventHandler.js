const fs = require('fs');
const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = async (client) => {
    try {
        let files = fs.readdirSync('./events/');
        files.forEach(file => {
            const eventFunction = require(`./../../events/${file}`);
            const eventName = file.split('.')[0];
            client.on(eventName, (...args) => eventFunction.run(client, ...args));
        });
        logger.debug('discordEventHandler: Success! All Events were loaded successfully!');
    } catch (error) {
        logger.error(`discordEventHandler: Error: ${error}`);
    }
};