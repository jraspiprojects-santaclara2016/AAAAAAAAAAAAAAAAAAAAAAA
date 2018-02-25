const cache = new Map();

module.exports = {
    createPrefixCache: function(guildId) {
        cache.get(guildId).prefix = {
            'prefix': '!m.',
            'cached': false,
        };
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