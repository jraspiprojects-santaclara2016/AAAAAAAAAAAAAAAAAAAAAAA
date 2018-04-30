const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'queue',
    description: 'Display the music queue.',
    disabled: false,
    requireDB: false,
    execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if(!serverQueue) return message.channel.send('There is nothing playing.');
        let index = 1;
        message.channel.send(`
    ___**Song queue:**___
${serverQueue.songs.map(song => `**${index++} -** ${song.title}`).join('\n')}
    
***Now playing:*** ${serverQueue.songs[0].title}`, { split: true }).catch(error => {logger.error(`queue: Error: ${error}`);});
    },
};