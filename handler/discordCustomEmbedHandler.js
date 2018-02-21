const Discord = require('discord.js');
const config = require('../configuration/config.json');

exports.run = (client, title, fields, destination) => {
    console.log(fields);
    const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor('DARK_GREEN')
        .setTimestamp()
        .setFooter('By ' + config.botName)
    ;

    for(const field of fields) {
        embed.addField(field.name, field.value);
    }

    destination.send({ embed }).catch(console.error);
};