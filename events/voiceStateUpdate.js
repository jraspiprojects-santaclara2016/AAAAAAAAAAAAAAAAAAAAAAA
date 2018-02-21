const voiceHandler = require('../handler/voiceHandler');
const winstonLogHandler = require('../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

exports.run = (client, oldMember, newMember) => {
    logger.debug(queue);
    logger.debug(newMember);
};