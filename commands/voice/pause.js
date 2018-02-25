const voiceHandler = require('../../handler/command/voiceHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'pause',
    description: 'Pause the music.',
    execute(client, message) {
        const serverQueue = queue.get(message.guild.id);
        if(serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            message.channel.send('Paused the music.');
        } else {
            message.channel.send('Nothing playing. Cannot pause.').catch(error => {logger.error(`pause: Error: ${error}`);});
        }
    },
};
