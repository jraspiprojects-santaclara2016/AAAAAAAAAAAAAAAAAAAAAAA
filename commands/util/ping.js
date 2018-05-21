const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'ping',
    description: 'pong!',
    disabled: false,
    requireDB: false,
    async execute(client, message) {
        message.channel.send('pong!').catch(error => {
            logger.error(`Ping: Error sending message: ${error}`);
        });
    },
};