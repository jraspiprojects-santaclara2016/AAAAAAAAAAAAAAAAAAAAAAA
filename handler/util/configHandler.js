const fs = require('fs');
const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();

let config;

try {
    config = require('../../configuration/config');
    logger.debug('configHandler: Success! Configuration loaded successfully!');
} catch (error) {
    logger.warn('configHandler: No Configuration File found. Writing sample ...');
    writeSampleConfig();
}

function writeSampleConfig() {
    const sampleConfig = {
        'general': {
            'botName': 'Monika',
            'commandPrefix': '!m.',
            'presenceGame': '@Monika help',
            'ownerID': '127938763535024128',
        },
        'league': {
            'rateLimit': 20,
            'baseURL': '.api.riotgames.com',
        },
        'danbooru': {
            'imageLimit': 100,
        },
    };
    try {
        fs.writeFileSync('./configuration/config.json', JSON.stringify(sampleConfig));
        logger.debug('configHandler: Writing sampleConfig succesfull!');
        config = sampleConfig;
    } catch (error) {
        logger.error(`configHandler: Error writing sample: ${error}`);
    }
}

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