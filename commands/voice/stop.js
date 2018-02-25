const voiceHandler = require('../../handler/voiceHandler');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'stop',
    description: 'Stop the current queue and leave the voice channel.',
    execute(client, message) {
        const serverQueue = queue.get(message.guild.id);
        if(!serverQueue) return message.channel.send('There is nothing playing I could stop for you.');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        logger.debug('stop: dispatcher end event called.');
    },
};