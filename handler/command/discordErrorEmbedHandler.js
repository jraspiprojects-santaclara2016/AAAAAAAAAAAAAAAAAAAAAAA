const Discord = require('discord.js');
const configHandler = require('../util/configHandler');
const winstonLogHandler = require('../util/winstonLogHandler');

const logger = winstonLogHandler.getLogger();
let generalConfig;

exports.run = (client, message, errorMessage) => {
    generalConfig = configHandler.getGeneralConfig();
    const embed = new Discord.MessageEmbed()
        .setTitle(generalConfig.botName + ' error:')
        .setColor('DARK_RED')
        .addField('Error', errorMessage)
        .setTimestamp()
        .setFooter('By ' + generalConfig.botName)
    ;
    message.channel.send(embed).catch(error => logger.error(`discordErrorEmbedHandler: Error sending message: ${error}`));
};