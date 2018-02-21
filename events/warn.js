const winstonLogHandler = require('../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client, args) => {
    logger.warn(`Received WARN event from Discord.js! info= ${args}`);
};