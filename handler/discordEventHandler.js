const fs = require('fs');
const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client) => {
    fs.readdir('./events/', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            const eventFunction = require(`./../events/${file}`);
            const eventName = file.split('.')[0];
            client.on(eventName, (...args) => eventFunction.run(client, ...args));
        });
    });
    logger.debug('discordEventHandler: Success! All events were loaded successfully!');
};