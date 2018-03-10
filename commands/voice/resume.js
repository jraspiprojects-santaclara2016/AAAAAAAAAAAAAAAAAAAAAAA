const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');

module.exports = {
    name: 'resume',
    description: 'Resume the music.',
    disabled: false,
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            discordCustomEmbedHandler.run(client, 'Resume', [{
                name: 'Resumed the music.',
                value: ':play_pause:',
            }], message.channel);
            logger.debug('resume: Music resumed.');
        } else {
            discordCustomEmbedHandler.run(client, 'Resume', [{
                name: 'Currently playing. Cannot resume.',
                value: '-',
            }], message.channel);
            logger.debug('resume: Could not resume, Nothing is in the queue.');
        }
    },
};