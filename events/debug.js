const winstonLogHandler = require('../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client, args) => {
    logger.silly(`Received DEBUG event from Discord.js! info=${args}`);
};