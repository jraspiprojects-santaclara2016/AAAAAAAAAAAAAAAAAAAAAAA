const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'resume',
    description: 'Resume the music.',
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if(serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            message.channel.send('Resumed the music.');
            logger.debug('resume: Music resumed.');
        } else {
            message.channel.send('Currently playing. Cannot resume.');
            logger.debug('resume: Could not resume, Nothing is in the queue.');
        }
    },
};