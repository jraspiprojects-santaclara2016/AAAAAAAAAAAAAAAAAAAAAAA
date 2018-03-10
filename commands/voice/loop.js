const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');

module.exports = {
    name: 'loop',
    description: 'loop/unloop the current playing music.',
    disabled: false,
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            discordCustomEmbedHandler.run(client, 'Loop', [{
                name: 'Toggled loop:',
                value: `${serverQueue.loop}`,
            }], message.channel);
            logger.debug(`loop: loop toggled to: ${serverQueue.loop}`);
        }
    },
};