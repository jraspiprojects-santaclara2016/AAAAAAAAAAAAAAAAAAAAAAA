const Discord = require('discord.js');
const config = require('../../configuration/config');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'serverinfo',
    description: 'Information about the server.',
    disabled: false,
    execute(client, message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Serverinfo:')
            .setColor('DARK_GREEN')
            .setThumbnail(message.guild.iconURL())
            .addField('Name:', message.guild.name)
            .addField('ID:', message.guild.id)
            .addField('Created at:', message.guild.createdAt)
            .setFooter(`By ${config.botName}`)
            .setTimestamp()
        ;
        message.channel.send({ embed }).catch(error => {
            logger.error(`ServerInfo: Error sending message: ${error}`);
        });
    },
};