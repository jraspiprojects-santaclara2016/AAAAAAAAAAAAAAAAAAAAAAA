const winstonLogHandler = require('../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client, args) => {
    logger.warn(`Received WARN event from Discord.js! info= ${args}`);
};