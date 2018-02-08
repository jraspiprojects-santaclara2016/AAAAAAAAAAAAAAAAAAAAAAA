/**
 * This file is handling the {commandPrefix}ping command.
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');

//This segment is executed whenever the bot receives a ping command
exports.run = (client, message, args, logger) => {
    //Respond to {commandPrefix}ping with a "pong!"
    message.channel.send("pong!").catch(console.error);
};