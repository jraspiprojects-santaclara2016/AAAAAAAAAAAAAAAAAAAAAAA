const apiKeys = require('../../configuration/apiKeyConfig');

exports.run = (client, logger) => {
    client.login(apiKeys.discord).then(() => {
        logger.info('discordLoginHandler: I connected to the Discord server!');
    }).catch((error) => {
        logger.error(`discordLoginHandler: I had troubles connecting to the Discord servers! \n ${error}`);
    });
};