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
        .addField('!m.8ball','Ask 8ball a question and get true answers!')
        .addField('!m.clear','Clears the chat.')
        .addField('!m.coinflip','Flips a coin.')
        .addField('!m.help','Get this message delivered to you. (obviously...)')
        .addField('!m.kona [tags]','Post a random image from konachan.com (if no tags are specified)')
        .addField('!m.ping','Responds with pong!')
        .addField('!m.rule34 [tags]','You know what that means :^)')
        .addField('!m.safebooru [tags]','Post a random image from Safebooru.org (if no tags are specified)')
        .addField('!m.setPermission @mention [level]','Set permissions for other users. (only Owners can do this)')
        .addField('!m.weather [location]','Get the current weather for a given location.')
        .addField('!m.whoami [@mention]','Responds either with your or a mentioned user profile.')
        .addField('!m.yandere [tags]','Post a random image from yande.re (if no tags are specified)')
        .setColor('DARK_GREEN')
        .setFooter('By ' + config.botName)
        .setTimestamp()
    ;
    message.author.send({embed}).catch(console.error);
};