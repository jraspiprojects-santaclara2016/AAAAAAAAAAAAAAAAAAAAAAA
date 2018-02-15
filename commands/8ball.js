const Discord = require('discord.js');
const config = require('../configuration/config.json');

exports.run = (client, message, args, logger) => {
    const answers = ['It is certain', 'As I see it, yes', 'Reply hazy try again', 'Don\'t count on it',
                     'It is decidedly so', 'Most likely', 'Ask again later', 'My reply is no',
                     'Without a doubt', 'Outlook good', 'Better not tell you now', 'My sources say no',
                     'Yes definitely', 'Yes', 'Cannot predict now', 'Outlook not so good', 'You may rely on it',
                     'Signs point to yes', 'Concentrate and ask again', 'Very doubtful'];
    const index = Math.floor(Math.random()*answers.length);
    logger.info('8ball executed');
    let embed = new Discord.MessageEmbed()
        .setTitle('8ball Command:')
        .setColor('DARK_GREEN')
        .addField('8ball says:',answers[index])
        .setFooter('By ' + config.botName)
        .setTimestamp()
    ;
    message.channel.send({embed}).catch(console.error);

};