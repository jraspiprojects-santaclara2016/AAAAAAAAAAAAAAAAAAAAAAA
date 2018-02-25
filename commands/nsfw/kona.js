const danbooruHandler = require('../../handler/command/danbooruHelperJson');

module.exports = {
    name: 'kona',
    description: 'Get a random image from Konachan.com',
    execute(client, message, args) {
        danbooruHandler.run(client, message, args, 'https://konachan.com/', 'Konachan');
    },
};