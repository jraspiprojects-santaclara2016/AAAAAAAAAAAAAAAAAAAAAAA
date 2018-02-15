/**
 * This file is for the ready event that gets emitted whenever the bot is ready to execute incoming requests.
 * @author emdix
 **/

//Import the config file located in /configuration/config.json
const config = require('../configuration/config');

//This segment is executed when the onReady event is called.
exports.run = (client,logger, args,) => {
    logger.info('I\'m ready to follow your orders');
    client.user.setActivity(config.presenceGame, {type: 'WATCHING'}).then((response) => {
        logger.info('Presence set to: ' + response.activity.name);
    }).catch((error) => {
        logger.error('I failed to set the Presence!');
        logger.error(error);
    });
};