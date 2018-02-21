const winstonLogHandler = require('../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client, args) => {
    logger.error(args.error.Error);
};