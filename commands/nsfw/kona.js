const danbooruHandler = require('../../handler/danbooruHelperJson');

module.exports = {
    name: 'kona',
    description: 'Get a random image from Konachan.com',
    execute(client, message, args, logger) {
        danbooruHandler.run(client, message, args, 'https://konachan.com/', 'Konachan');
    },
};