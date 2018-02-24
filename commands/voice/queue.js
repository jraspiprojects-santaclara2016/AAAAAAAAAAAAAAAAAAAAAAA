const voiceHandler = require('../../handler/voiceHandler');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'queue',
    description: 'Display the music queue.',
    execute(client, message) {
        const serverQueue = queue.get(message.guild.id);
        if(!serverQueue) return message.channel.join('There is nothing playing.');
        let index = 1;
        message.channel.send(`
    ___**Song queue:**___
${serverQueue.songs.map(song => `**${index++} -** ${song.title}`).join('\n')}
    
***Now playing:*** ${serverQueue.songs[0].title}`, { split: true }).catch(error => {logger.error(`queue: Error: ${error}`);});
    },
};