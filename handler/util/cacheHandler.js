const prefixCache = new Map();
const musicQueueCache = new Map();
const winstonLogHandler = require('./winstonLogHandler');

const logger = winstonLogHandler.getLogger();

module.exports = {
    createPrefixCache: function(guildId, prefix) {
        logger.debug(`cacheHandler: Created Prefix in Cache: ${prefix} for guild: ${guildId}`);
        prefixCache.set(guildId, { 'prefix': `${prefix}` });
    },
    createMusicQueueCache: function(guildId) {
        logger.debug(`cacheHandler: Created MusicQueueCache for guild: ${guildId}`);
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