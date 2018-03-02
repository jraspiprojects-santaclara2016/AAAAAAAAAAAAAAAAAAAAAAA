const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'pause',
    description: 'Pause the music.',
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if(serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            message.channel.send('Paused the music.');
        } else {
            message.channel.send('Nothing playing. Cannot pause.').catch(error => {logger.error(`pause: Error: ${error}`);});
        }
    },
};
