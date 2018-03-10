const winstonLogHandler = require('../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const config = require('../configuration/config');

exports.run = (client) => {
    logger.info('Ready: I\'m ready to follow your orders');
    client.user.setActivity(config.presenceGame, { type: 'WATCHING' }).then((response) => {
        logger.info('Ready: Presence set to: ' + response.activity.name);
    }).catch((error) => {
        logger.error(`Ready: I failed to set the Presence! Error: ${error}`);
    });
};