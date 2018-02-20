const voiceHandler = require('../../handler/voiceHandler');
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'np',
    description: 'Now playing command for the voice integration.',
    execute(client, message, args, logger) {
        const serverQueue = queue.get(message.guild.id);
        if(!serverQueue) return message.channel.join('There is nothing playing.');
        message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
    },
};