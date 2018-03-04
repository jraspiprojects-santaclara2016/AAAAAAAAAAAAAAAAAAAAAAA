const winstonLogHandler = require('../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client, args) => {
    logger.error(`Error: ${args.error.Error}`);
};