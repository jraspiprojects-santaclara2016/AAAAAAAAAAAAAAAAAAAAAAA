const danbooruHandler = require('../../handler/danbooruHelperXml');

module.exports = {
    name: 'rule34',
    description: 'Get a random image from rule34.xxx',
    execute(client, message, args, logger) {
        danbooruHandler.run(client, message, args, 'https://rule34.xxx/', 'Rule34', '');
    },
};