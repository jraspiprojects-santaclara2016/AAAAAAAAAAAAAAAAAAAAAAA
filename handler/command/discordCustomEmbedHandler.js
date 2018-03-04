const Discord = require('discord.js');
const config = require('../../configuration/config.json');
const winstonLogHandler = require('../util/winstonLogHandler');

const logger = winstonLogHandler.getLogger();

exports.run = (client, title, fields, destination) => {
    logger.debug(`discordCustomEmbedHandler: ${fields}`);
    const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor('DARK_GREEN')
        .setTimestamp()
        .setFooter('By ' + config.botName)
    ;

    for (const field of fields) {
        embed.addField(field.name, field.value);
    }

    destination.send({ embed }).catch(error => logger.error(`discordCustomEmbedHandler: Error sending message: ${error}`));
};