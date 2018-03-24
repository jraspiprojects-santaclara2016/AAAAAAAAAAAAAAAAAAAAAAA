const Discord = require('discord.js');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const configHandler = require('../../handler/util/configHandler');

module.exports = {
    name: 'whoami',
    description: 'Display information either about you, or somebody you\'ve mentioned.',
    disabled: false,
    execute(client, message, args) {
        let user;
        if (args.length === 1 && message.mentions.users.first() !== undefined) {
            user = message.mentions.users.first();
        } else {
            user = message.author;
        }
        const embed = new Discord.MessageEmbed()
            .setTitle('Whoami command:')
            .setThumbnail(user.avatarURL())
            .setColor('DARK_GREEN')
            .addField('Name:', user.tag)
            .addField('UserID:', user.id)
            .addField('Created at:', user.createdAt)
            .setFooter('By ' + configHandler.getGeneralConfig().botName)
            .setTimestamp()
        ;
        message.channel.send({ embed }).catch(error => {
            logger.error(`WhoAmI: Error sending message: ${error}`);
        });
    },
};