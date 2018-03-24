const secrets = require('../../configuration/secrets');

const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.getLogger();

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