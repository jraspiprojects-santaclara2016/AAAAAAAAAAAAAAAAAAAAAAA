const voiceHandler = require('../../handler/command/voiceHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'np',
    description: 'Now playing command for the voice integration.',
    execute(client, message) {
        const serverQueue = queue.get(message.guild.id);
        if(!serverQueue) return message.channel.send('There is nothing playing.');
        message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`).catch(error => {logger.error(`np: Error: ${error}`);});
    },
};