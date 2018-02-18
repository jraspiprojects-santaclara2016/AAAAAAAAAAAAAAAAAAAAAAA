const Discord = require('discord.js');

const config = require('../../configuration/config');

module.exports = {
    name: 'whoami',
    description: 'Display information either about you, or somebody you\'ve mentioned.',
    execute(client, message, args, logger) {
        let user;
        if(args.length === 1 && message.mentions.users.first() !== undefined) {
            user = message.mentions.users.first();
        } else {
            user = message.author;
        }
        const embed = new Discord.MessageEmbed()
            .setTitle('Whoami command:')
            .setThumbnail(user.avatarURL)
            .setColor('DARK_GREEN')
            .addField('Name:', user.tag)
            .addField('UserID:', user.id)
            .addField('Created at:', user.createdAt)
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({ embed }).catch(console.error);
    },
};