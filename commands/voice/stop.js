const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');


module.exports = {
    name: 'stop',
    description: 'Stop the current queue and leave the voice channel.',
    disabled: false,
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if (!serverQueue) {
            return discordCustomEmbedHandler.run(client, 'Stop', [{
                name: 'There is nothing playing I could stop for you.',
                value: '-',
            }], message.channel);
        }
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        logger.debug('stop: dispatcher end event called.');
    },
};