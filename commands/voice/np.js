const cacheHandler = require('../../handler/util/cacheHandler');
const musicCache = cacheHandler.getMusicCache();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');

module.exports = {
    name: 'np',
    description: 'Now playing command for the voice integration.',
    disabled: false,
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing.');
        discordCustomEmbedHandler.run(client, 'Now Playing', [{
            name: 'Currently playing:',
            value: `**${serverQueue.songs[0].title}**`,
        }], message.channel);
    },
};