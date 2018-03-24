const Discord = require('discord.js');
const configHandler = require('../util/configHandler');
const generalConfig = configHandler.getGeneralConfig();
const winstonLogHandler = require('../util/winstonLogHandler');

const logger = winstonLogHandler.getLogger();

exports.run = (client, title, fields, destination) => {
    logger.debug(`discordCustomEmbedHandler: ${fields}`);
    const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor('DARK_GREEN')
        .setTimestamp()
        .setFooter('By ' + generalConfig.botName)
    ;

    for (const field of fields) {
        embed.addField(field.name, field.value);
    }

    destination.send(embed).catch(error => logger.error(`discordCustomEmbedHandler: Error sending message: ${error}`));
};