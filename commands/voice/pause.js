const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');


module.exports = {
    name: 'pause',
    description: 'Pause the music.',
    disabled: false,
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            discordCustomEmbedHandler.run(client, 'Pause', [{
                name: 'Paused the music.',
                value: ':play_pause:',
            }], message.channel);
        } else {
            discordCustomEmbedHandler.run(client, 'Pause', [{
                name: 'Nothing playing. Cannot pause.',
                value: '-',
            }], message.channel);
        }
    },
};
