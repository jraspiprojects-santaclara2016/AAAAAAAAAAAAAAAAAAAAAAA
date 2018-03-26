const winstonLogHandler = require('../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = async (client, args) => {
    logger.error(`Error: ${args.error.Error}`);
};