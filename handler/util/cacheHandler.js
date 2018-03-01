const prefixCache = new Map();
const musicQueueCache = new Map();

module.exports = {
    createPrefixCache: function(guildId, prefix) {
        prefixCache.set(guildId, { 'prefix': `${prefix}` });
    },
    createMusicQueueCache: function(guildId) {
        musicQueueCache.set(guildId, {
            'textChannel': null,
            'voiceChannel': null,
            'connection': null,
            'songs': [],
            'volume': 0.1,
            'playing': false,
            'loop': false,
        });
    },
    getMusicCache: function() {
        return musicQueueCache;
    },
    getPrefixCache: function() {
        return prefixCache;
    },
};