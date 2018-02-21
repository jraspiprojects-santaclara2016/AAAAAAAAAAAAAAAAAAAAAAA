const voiceHandler = require('../../handler/voiceHandler');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'skip',
    description: 'Skip to the next song.',
    execute(client, message) {
        const serverQueue = queue.get(message.guild.id);
        if(!serverQueue) return message.channel.join('There is nothing playing I could skip for you.');
        if(serverQueue.loop) serverQueue.loop = !serverQueue.loop;
        serverQueue.connection.dispatcher.end();
        logger.debug('skip: dispatcher end executed.');
    },
};