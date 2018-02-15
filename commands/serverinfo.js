const Discord = require('discord.js');
const config = require('../configuration/config');

exports.run = (client, message, args, logger) => {
    //creating embed
    let embed = new Discord.MessageEmbed()
        .setTitle('Serverinfo:')
        .setColor('DARK_GREEN')
        .setThumbnail(message.guild.iconURL)
        .addField('Name:', message.guild.name)
        .addField('ID:', message.guild.id)
        .addField('Created at:', message.guild.createdAt)
        .setFooter(`By ${config.botName}`)
        .setTimestamp()
    ;

    message.channel.send({embed});
};