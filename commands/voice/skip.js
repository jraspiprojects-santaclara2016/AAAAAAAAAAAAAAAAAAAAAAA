const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'skip',
    description: 'Skip to the next song.',
    disabled: false,
    execute(client, message) {
        const musicQueue = musicCache.get(message.guild.id);
        if(!musicQueue) return message.channel.send('There is nothing playing I could skip for you.');
        if(musicQueue.loop) musicQueue.loop = !musicQueue.loop;
        musicQueue.connection.dispatcher.end();
        logger.debug('skip: dispatcher end executed.');
    },
};