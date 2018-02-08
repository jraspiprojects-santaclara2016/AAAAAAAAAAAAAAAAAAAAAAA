/**
 * This file is handling the {commandPrefix}yandere command.
 * @author emdix
 **/

//This segment is executed whenever the bot receives a yandere command
exports.run = (client, message, args, logger) => {
    let danbooruHandler = require('../handler/danbooruHelperXml');
    danbooruHandler.run(client, message, args, 'https://safebooru.org/', 'Safebooru', 'https:');
};