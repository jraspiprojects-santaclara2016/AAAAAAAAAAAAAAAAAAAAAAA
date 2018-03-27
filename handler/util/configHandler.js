const fs = require('fs');
const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();

let config;
let sampleConfig;

async function generateSampleConfig(client) {
    const botName = client.user.username;
    let botPrefix;
    if (isCharLetter(botName.charAt(0))) {
        botPrefix = botName.charAt(0);
    } else {
        botPrefix = 'b';
    }
    console.log(client);
    sampleConfig = {
        'general': {
            'botName': `${botName}`,
            'commandPrefix': `!${botPrefix}.`,
            'presenceGame': `@${botName} help`,
        },
        'league': {
            'rateLimit': 20,
            'baseURL': '.api.riotgames.com',
        },
        'danbooru': {
            'imageLimit': 100,
        },
    };
}

function writeSampleConfig() {
    try {
        fs.writeFileSync('./configuration/config.json', JSON.stringify(sampleConfig));
        logger.debug('configHandler: Writing sampleConfig succesfull!');
        config = sampleConfig;
    } catch (error) {
        logger.error(`configHandler: Error writing sample: ${error}`);
    }
}

function isCharLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
}


module.exports = {
    initialize: async function(client) {
        try {
            config = require('../../configuration/config');
            logger.debug('configHandler: Success! Configuration loaded successfully!');
        } catch (error) {
            logger.warn('configHandler: No Configuration File found. Writing sample ...');
            await generateSampleConfig(client);
            writeSampleConfig();
        }
    },
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