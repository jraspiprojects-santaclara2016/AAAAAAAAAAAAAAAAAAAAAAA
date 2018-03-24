const config = require('../../configuration/config');

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