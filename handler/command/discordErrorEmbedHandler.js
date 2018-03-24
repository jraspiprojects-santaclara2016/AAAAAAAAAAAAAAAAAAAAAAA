const Discord = require('discord.js');
const configHandler = require('../util/configHandler')
const generalConfig = configHandler.getGeneralConfig();
const winstonLogHandler = require('../util/winstonLogHandler');

const logger = winstonLogHandler.getLogger();

exports.run = (client, message, errorMessage) => {
    const embed = new Discord.MessageEmbed()
        .setTitle(config.botName + ' error:')
        .setColor('DARK_RED')
        .addField('Error', errorMessage)
        .setTimestamp()
        .setFooter('By ' + generalConfig.botName)
    ;
    message.channel.send(embed).catch(error => logger.error(`discordErrorEmbedHandler: Error sending message: ${error}`));
};