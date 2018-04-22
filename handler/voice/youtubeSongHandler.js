const cacheHandler = require('../../handler/util/cacheHandler');
const secretHandler = require('../../handler/util/secretHandler');
const youtubeAPI = require('simple-youtube-api');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const musicQueueHandler = require('../voice/musicQueueHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();
const youtubeClient = new youtubeAPI(secretHandler.getApiKey('YOUTUBE_KEY'));

module.exports = {
    async handleYoutubeLink(youtubeLink, message, voiceChannel) {
        if(await isYoutubePlaylist(youtubeLink)) return await handleYoutubePlaylist(youtubeLink, message, voiceChannel);
        const videoObject = await youtubeClient.getVideo(youtubeLink);
        await handleYoutubeVideo(videoObject, message, voiceChannel);
    },
    async youtubeSearch(searchString, message, voiceChannel) {
        let video;
        try {
            const videos = await youtubeClient.searchVideos(searchString, 10);
            let index = 1;
            message.channel.send(`
___**Search results:**___
${videos.map(searchVideo => `**${index++} -** ${searchVideo.title}`).join('\n')}
    
***Usage: 1-10 (Timeout 10sec)***`);
            try {
                const response = await message.channel.awaitMessages(m => m.author === message.author && m.content > 0 && m.content < 11, {
                    max: 1,
                    time: 10000,
                    errors: ['time'],
                });
                const videoIndex = parseInt(response.first().content);
                video = await youtubeClient.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                logger.error(`play: Error: ${err}`);
                return message.channel.send('No or invalid value entered, cancelling video selection.');
            }
        } catch (err) {
            logger.error(`play: Error: ${err}`);
            return message.channel.send('I could not obtain any search results.');
        }
        await handleYoutubeVideo(video, message, voiceChannel);
    },
};

async function isYoutubePlaylist(link) {
    return link.match(/^https?:\/\/(www.youtube.com|youtube.com)\/.*list(.*)$/);
}

async function handleYoutubePlaylist(youtubePlaylistLink, message, voiceChannel) {
    logger.debug('Indexing playlist');
    const playlist = await youtubeClient.getPlaylist(youtubePlaylistLink);
    const videos = await playlist.getVideos();
    message.channel.send(`The Playlist **${playlist.title}** has been added to the queue!`);
    for(const video of videos) {
        await handleYoutubeVideo(video, message, voiceChannel, true);
    }
}

async function handleYoutubeVideo(video, message, voiceChannel, playlist = false) {
    let musicQueue = musicCache.get(message.guild.id);
    const song = {
        id: video.id,
        title: video.title,
        url: `https://youtube.com/watch?v=${video.id}`,
        requested_by: message.author,
        type: video.kind,
        thumbnail: video.thumbnails.default.url,
        publishedAt: video.publishedAt,
        uploader: video.channel.title,
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
        if(!playlist) return message.channel.send(`**${song.title}** has been added to the queue!`);
    }
}
