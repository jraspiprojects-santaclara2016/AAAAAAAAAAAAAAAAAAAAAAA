const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');

module.exports = {
    name: 'skip',
    description: 'Skip to the next song.',
    disabled: false,
    execute(client, message) {
        const musicQueue = musicCache.get(message.guild.id);
        if (!musicQueue) {
            return discordCustomEmbedHandler.run(client, 'Skip', [{
                name: 'There is nothing playing I could skip for you.',
                value: '-',
            }], message.channel);
        }
        if (musicQueue.loop) musicQueue.loop = !musicQueue.loop;
        musicQueue.connection.dispatcher.end();
        logger.debug('skip: dispatcher end executed.');
    },
};