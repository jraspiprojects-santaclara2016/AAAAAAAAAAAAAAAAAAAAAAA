const cache = new Map();

module.exports = {
    createPrefixCache: function(guildId, prefix) {
        cache.set(guildId, { 'prefix': `${prefix}` });
    },
    createMusicQueueCache: function(guildId) {
        cache.get(guildId).musicQueue = {
            'textChannel': null,
            'voiceChannel': null,
            'connection': null,
            'songs': [],
            'volume': 0.1,
            'playing': false,
            'loop': false,
        };
    },
    getCache: function() {
        return cache;
    },
};