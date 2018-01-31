/**
 * This file is for the ready event that gets emitted whenever the bot is ready to execute incoming requests.
 * @author emdix
 **/

//Import the config file located in /configuration/config.json
const config = require('../configuration/config');

//This segment is executed when the onReady event is called.
exports.run = (client, args) => {
    console.log('I\'m ready to follow your orders');
    //Set the "playing {presenceGame}" in Discord.
    client.user.setActivity(config.presenceGame).then((response) => {
        console.log('Presence set to: ' + response.presence.game.name);
    }).catch((error) => {
        console.log('I failed to set the Presence!');
        console.log(error);
    });
}