const danbooruHandler = require('../../handler/command/danbooruHelperXml');

module.exports = {
    name: 'safebooru',
    description: 'Get a random image from safebooru.org',
    disabled: false,
    execute(client, message, args) {
        danbooruHandler.run(client, message, args, 'https://safebooru.org/', 'Safebooru', 'https:');
    },
};