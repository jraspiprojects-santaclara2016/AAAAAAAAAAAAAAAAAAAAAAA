/**
 * This file is handling the {commandPrefix}help command.
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');

//Require needed config or permission files.
const config = require('../configuration/config');

//This segment is executed whenever the bot receives a help command
exports.run = (client, message, args) => {
    //Building and sending an embedded message.
    let embed = new Discord.RichEmbed()
        .setTitle('Help Command:')
        .addField('!m.help','Get this message delivered to you. (obviously...)')
        .addField('!m.clear','Clears the chat.')
        .setColor('DARK_GREEN')
        .setFooter('By ' + config.botName)
        .setTimestamp()
    ;
    message.author.send({embed}).catch(console.error);
};