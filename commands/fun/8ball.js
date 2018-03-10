const Discord = require('discord.js');
const config = require('../../configuration/config.json');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: '8ball',
    description: 'Ask the magic 8ball for TRUE answers!',
    disabled: false,
    execute(client, message) {
        const answers = ['It is certain', 'As I see it, yes', 'Reply hazy try again', 'Don\'t count on it',
            'It is decidedly so', 'Most likely', 'Ask again later', 'My reply is no',
            'Without a doubt', 'Outlook good', 'Better not tell you now', 'My sources say no',
            'Yes definitely', 'Yes', 'Cannot predict now', 'Outlook not so good', 'You may rely on it',
            'Signs point to yes', 'Concentrate and ask again', 'Very doubtful'];
        const index = Math.floor(Math.random() * answers.length);
        logger.silly(`8ball: 8ball prints out the index ${index} of the array.`);
        const embed = new Discord.MessageEmbed()
            .setTitle('8ball Command:')
            .setColor('DARK_GREEN')
            .addField('8ball says:', answers[index])
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send(embed).catch(error => logger.error(`8ball: Error sending message: ${error}`));
    },
};