const Discord = require('discord.js');
const config = require('../configuration/config.json');

exports.run = (client, message, errorMessage) => {
    let embed = new Discord.RichEmbed()
        .setTitle(config.botName + ' error:')
        .setColor('DARK_RED')
        .addField('Error', errorMessage)
        .setTimestamp()
        .setFooter('By ' + config.botName)
    ;
    message.channel.send({embed}).catch(console.error);
};