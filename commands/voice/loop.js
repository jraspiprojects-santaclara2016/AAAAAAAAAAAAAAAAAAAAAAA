const voiceHandler = require('../../handler/command/voiceHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'loop',
    description: 'loop/unloop the current playing music.',
    execute(client, message) {
        const serverQueue = queue.get(message.guild.id);
        if(serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            message.channel.send(`Toggled loop to: ${serverQueue.loop}`);
            logger.debug(`loop: loop toggled to: ${serverQueue.loop}`);
        }
    },
};