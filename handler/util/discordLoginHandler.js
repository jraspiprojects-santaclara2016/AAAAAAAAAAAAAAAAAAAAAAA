const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const apiKeys = require('../../configuration/apiKeyConfig');

exports.run = (client) => {
    client.login(apiKeys.discord).then(() => {
        logger.info('discordLoginHandler: I connected to the Discord server!');
    }).catch((error) => {
        logger.error(`discordLoginHandler: I had troubles connecting to the Discord servers! \n ${error}`);
    });
};