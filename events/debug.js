const winstonLogHandler = require('../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client, args) => {
    logger.silly(`Received DEBUG event from Discord.js! info=${args}`);
};