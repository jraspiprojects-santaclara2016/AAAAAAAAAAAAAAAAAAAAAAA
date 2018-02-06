/**
 * This file is handling the {commandPrefix}kona command.
 * @author emdix
 **/

//This segment is executed whenever the bot receives a yandere command
exports.run = (client, message, args) => {
    let danbooruHandler = require('../handler/danbooru-helper-json');
    danbooruHandler.run(client, message, args, 'https://konachan.com/', 'Konachan');
};