const config = require('../../configuration/config');

const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    getGeneralConfig: function() {
        return config.general;
    },
    getLeagueConfig: function() {
        return config.league;
    },
    getDanbooruConfig: function() {
        return config.danbooru;
    },
};