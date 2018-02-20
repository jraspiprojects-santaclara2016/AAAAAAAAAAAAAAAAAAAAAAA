const voiceHandler = require('../../handler/voiceHandler');
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'loop',
    description: 'loop/unloop the current playing music.',
    execute(client, message, args, logger) {
        const serverQueue = queue.get(message.guild.id);
        if(serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            message.channel.send(`Toggled loop to: ${serverQueue.loop}`);
        }
    },
};