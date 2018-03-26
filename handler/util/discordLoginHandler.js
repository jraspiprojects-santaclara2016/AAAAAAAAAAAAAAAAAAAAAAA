const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const secretHandler = require('./secretHandler');

exports.run = async (client) => {
    try {
        client.login(secretHandler.getApiKey('DISCORD_KEY'));
        logger.info('discordLoginHandler: I connected to the Discord server!');
    } catch (error) {
        logger.error(`discordLoginHandler: I had troubles connecting to the Discord servers! \n ${error}`);
    }
};