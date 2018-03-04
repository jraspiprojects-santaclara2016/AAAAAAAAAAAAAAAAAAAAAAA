const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'stats',
    description: 'Show stats about the bot.',
    execute(client, message) {
        client.shard.fetchClientValues('guilds.size')
            .then(results => {
                message.channel.send(`${results.reduce((prev, val) => prev + val, 0)} total guilds`);
            })
            .catch(error => {
                logger.error(`Stats: Error: ${error}`);
            });
    },
};