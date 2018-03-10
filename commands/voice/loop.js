const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'loop',
    description: 'loop/unloop the current playing music.',
    disabled: false,
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if(serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            message.channel.send(`Toggled loop to: ${serverQueue.loop}`);
            logger.debug(`loop: loop toggled to: ${serverQueue.loop}`);
        }
    },
};