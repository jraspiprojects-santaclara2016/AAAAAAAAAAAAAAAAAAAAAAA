const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const logHandler = require('../util/winstonLogHandler');
const cacheHandler = require('../util/cacheHandler');
const dispatcherHandler = require('../voice/dispatcherHandler');
const logger = logHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    async play(guildId, song) {
        const musicQueue = musicCache.get(guildId);
        if (!song) return dispatcherHandler.stop(guildId);
        let dispatcher;
        if(song.source === 'youtube') dispatcher = musicQueue.connection.play(ytdl(song.url, { type: 'opus', seek: 0, quality: 'highestaudio', retries: 10 }));
        if(song.source === 'stream') dispatcher = musicQueue.connection.play(song.url);
        dispatcher.on('finish', () => {
            logger.debug('play: Dispatcher.end() triggered.');
            if(!musicQueue.loop) musicQueue.songs.shift();
            this.play(guildId, musicQueue.songs[0]);
        })
            .on('error', error => logger.error(`play: Error: ${error}`))
            .on('debug', debug => logger.debug(`play: Error: ${debug}`))
        ;
        dispatcher.setVolume(musicQueue.volume);
        await sendStartedPlayingEmbed(musicQueue.textChannel, song);
    },
};

async function sendStartedPlayingEmbed(textChannel, song) {
    const embed = new Discord.MessageEmbed()
        .setTitle('🎵 Start Playing:')
        .setColor('DARK_RED')
        .setTimestamp(song.publishedAt)
        .setFooter(`By ${song.uploader}`)
        .setThumbnail(song.thumbnail)
        .addField('Title', `[${song.title}](${song.url})`)
        .addField('Requested by:', song.requested_by)
    ;
    textChannel.send(embed);
}