const danbooruHandler = require('../../handler/danbooruHelperXml');

module.exports = {
    name: 'safebooru',
    description: 'Get a random image from safebooru.org',
    execute(client, message, args) {
        danbooruHandler.run(client, message, args, 'https://safebooru.org/', 'Safebooru', 'https:');
    },
};