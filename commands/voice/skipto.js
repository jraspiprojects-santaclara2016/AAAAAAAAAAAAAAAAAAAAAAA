const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'skipto',
    description: 'Skip to a specified track in the queue.',
    disabled: false,
    async execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
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
            logger.error(`skipto: Error: ${err}`);
            return message.channel.send('No or invalid value entered, cancelling video selection.');
        }
        const playlistIndex = parseInt(response.first().content);
        for(let i = 0; i < playlistIndex - 2; i++) {
            serverQueue.songs.shift();
        }
        message.channel.send('Skipping...');
        if(playlistIndex > 1) {
            if(serverQueue.loop) serverQueue.loop = !serverQueue.loop;
            serverQueue.connection.dispatcher.end();
        }
    },
};