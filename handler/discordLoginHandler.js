const apiKeys = require('../configuration/apiKeyConfig');

exports.run = (client, logger) => {
    client.login(apiKeys.discord).then(() => {
        logger.info('I connected to the Discord server!');
    }).catch((error) => {
        logger.info('I had troubles connecting to the Discord servers!');
    });
};