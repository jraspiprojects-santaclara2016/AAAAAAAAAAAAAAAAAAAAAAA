const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'np',
    description: 'Now playing command for the voice integration.',
    disabled: false,
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if(!serverQueue) return message.channel.send('There is nothing playing.');
        message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`).catch(error => {logger.error(`np: Error: ${error}`);});
    },
};