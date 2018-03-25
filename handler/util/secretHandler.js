const fs = require('fs');
const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();

let secrets;

try {
    secrets = require('../../configuration/secrets');
    logger.debug('secretHandler: Success! Secrets loaded successfully!');
} catch (error) {
    logger.warn('secretHandler: No secrets File found. Writing sample ...');
    writeSampleConfig();
}

function writeSampleConfig() {
    const sampleSecrets = {
        'database': {
            'host': 'YOUR DATABASE HOSTNAME',
            'user': 'THE USER TO ACCES THE DB',
            'password': 'THE PASSWORD OF THE USER',
            'database': 'THE NAME OF THE DATABASE',
            'connectionLimit': 10,
        },
        'apiKeys': {
            'DISCORD_KEY': 'YOUR DISCORD API KEY',
            'LOL_KEY': 'YOUR LEAGUE API KEY',
            'YOUTUBE_KEY': 'YOUR YOUTUBE API KEY',
            'OPENWEATHERMAP_KEY': 'YOUR OPENWEATHERMAP API KEY',
        },
    };
    try {
        fs.writeFileSync('./configuration/secrets.json', JSON.stringify(sampleSecrets));
        logger.debug('secretHandler: Writing sampleSecrets succesfull!');
    } catch (error) {
        logger.error(`secretHandler: Error writing sample: ${error}`);
    }
    throw new Error('Please configure your secrets.json file under the configuration Folder!');
}

module.exports = {
    getDatabaseSecrets: function() {
        return secrets.database;
    },
    getApiKey: function(keyName) {
        let key;
        key = getKeyFromFile(keyName);
        if (key) return key;
        key = getKeyFromEnvironment(keyName);
        if (key) return key;
        logger.error(`secretHandler: Could not load ApiKey: ${keyName}`);
    },
};

function getKeyFromFile(keyName) {
    try {
        const key = secrets.apiKeys[keyName];
        if (Array.isArray(key)) {
            return key[Math.floor(Math.random() * key.length)];
        }
        return key;
    } catch (error) {
        logger.debug(`secretHandler: Key ${keyName} not found in secrets.json!`);
    }
}

function getKeyFromEnvironment(keyName) {
    try {
        return process.env[keyName];
    } catch (error) {
        logger.debug(`secretHandler: Key ${keyName} is not a environment variable!`);
    }
}