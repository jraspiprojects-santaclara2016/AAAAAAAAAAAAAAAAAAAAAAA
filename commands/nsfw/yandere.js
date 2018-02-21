const danbooruHandler = require('../../handler/danbooruHelperJson');

module.exports = {
    name: 'yandere',
    description: 'Get a random image from yande.re',
    execute(client, message, args) {
        danbooruHandler.run(client, message, args, 'https://yande.re/', 'Yandere');
    },
};