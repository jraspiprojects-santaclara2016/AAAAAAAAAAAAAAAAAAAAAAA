const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const musicQueueHandler = require('../voice/musicQueueHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    async handleStreamLink(link, message, voiceChannel) {
        let musicQueue = musicCache.get(message.guild.id);
        const date = new Date();
        const song = {
            id: '',
            source: 'stream',
            title: 'Generic Stream',
            url: link,
            requested_by: message.author,
            type: 'stream',
            thumbnail: '',
            publishedAt: date,
            uploader: 'undefined',
        };
        if(!musicQueue) {
            cacheHandler.createMusicQueueCache(message.guild.id);
            musicQueue = await musicCache.get(message.guild.id);
            musicQueue.textChannel = message.channel;
            musicQueue.voiceChannel = message.member.voiceChannel;
            musicQueue.songs.push(song);

            try {
                musicQueue.connection = await voiceChannel.join();
                musicQueueHandler.play(message.guild.id, musicQueue.songs[0]);
                musicQueue.playing = true;
            } catch (error) {
                logger.error(error);
                musicCache.delete(message.member.guild.id);
                message.channel.send('I could not join the voice channel!');
            }
        } else {
            musicQueue.songs.push(song);
            return message.channel.send(`**${song.title}** has been added to the queue!`);
        }
    },
};