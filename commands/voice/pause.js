const voiceHandler = require('../../handler/voiceHandler');
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'pause',
    description: 'Pause the music.',
    execute(client, message, args, logger) {
        const serverQueue = queue.get(message.guild.id);
        if(serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            message.channel.send('Paused the music.');
        } else {
            message.channel.send('Nothing playing. Cannot pause.');
        }
    },
};
