const danbooruHandler = require('../../handler/command/danbooruHelperJson');

module.exports = {
    name: 'yandere',
    description: 'Get a random image from yande.re',
    disabled: false,
    execute(client, message, args) {
        danbooruHandler.run(client, message, args, 'https://yande.re/', 'Yandere');
    },
};