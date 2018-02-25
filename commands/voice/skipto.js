const voiceHandler = require('../../handler/command/voiceHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'skipto',
    description: 'Skip to a specified track in the queue.',
    async execute(client, message) {
        const serverQueue = queue.get(message.guild.id);
        let index = 1;
        message.channel.send(`
    ___**Song queue:**___
${serverQueue.songs.map(song => `**${index++} -** ${song.title}`).join('\n')}
    
***Input the track number you want to skip to... (Timeout 10 sec)***
    `, { split: true }).catch(error => {logger.error(`skipto: Error: ${error}`);});
        let response;
        try {
            response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < serverQueue.songs.length + 1, {
                max: 1,
                time: 10000,
                errors: ['time'],
            });
        } catch (err) {
            console.error(err);
            return message.channel.send('No or invalid value entered, cancelling video selection.');
        }
        const playlistIndex = parseInt(response.first().content) - 1;
        for(let i = 0; i < playlistIndex - 1; i++) {
            serverQueue.songs.shift();
        }
        message.channel.send('Skipping...');
        if(playlistIndex > 1) {
            if(serverQueue.loop) serverQueue.loop = !serverQueue.loop;
            serverQueue.connection.dispatcher.end();
        }
    },
};