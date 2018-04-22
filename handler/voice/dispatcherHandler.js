const cacheHandler = require('../util/cacheHandler');
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    async setDispatcherVolume(dispatcher, guildId) {
        const musicQueue = musicCache.get(guildId);
        dispatcher.setVolume(musicQueue.volume);
    },
    async stop(guildId) {
        const musicQueue = musicCache.get(guildId);
        if(!musicQueue) return;
        musicQueue.songs = [];
        if(!musicQueue.playing) {
            musicQueue.playing = musicQueue.playing = true;
            await musicQueue.connection.dispatcher.resume();
        }
        musicQueue.connection.dispatcher.end();
        await musicQueue.voiceChannel.leave();
        musicCache.delete(guildId);
    },
};