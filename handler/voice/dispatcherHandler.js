const cacheHandler = require('../util/cacheHandler');
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    async setDispatcherVolume(dispatcher, guildId) {
        const musicQueue = musicCache.get(guildId);
        dispatcher.setVolume(musicQueue.volume);
    },
    async stop(guildId) {
        const musicQueue = musicCache.get(guildId);
        musicQueue.voiceChannel.leave();
        musicCache.delete(guildId);
    },
};