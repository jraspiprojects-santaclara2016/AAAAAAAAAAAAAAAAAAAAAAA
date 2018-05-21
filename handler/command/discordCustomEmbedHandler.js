const Discord = require('discord.js');
const configHandler = require('../util/configHandler');
const winstonLogHandler = require('../util/winstonLogHandler');

const logger = winstonLogHandler.getLogger();
let generalConfig;

exports.run = (client, title, fields, destination) => {
    generalConfig = configHandler.getGeneralConfig();
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