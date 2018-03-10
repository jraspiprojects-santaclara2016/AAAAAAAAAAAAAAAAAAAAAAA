const Discord = require('discord.js');
const config = require('../../configuration/config.json');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'coinflip',
    description: 'Flip a coin.',
    disabled: false,
    execute(client, message) {
        const flip = Math.round(Math.random());
        logger.silly(`Coinflip: I flipped a ${flip}`);
        if (flip === 0) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Coinflip Command:')
                .setColor('DARK_GREEN')
                .setImage('https://www.random.org/coins/faces/60-eur/germany-1euro/obverse.jpg')
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            message.channel.send(embed).catch(error => logger.error(`Coinflip: Error sending mesage: ${error}`));
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle('Coinflip Command:')
                .setColor('DARK_GREEN')
                .setImage('https://www.random.org/coins/faces/60-eur/germany-1euro/reverse.jpg')
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            message.channel.send(embed).catch(error => logger.error(`Coinflip: Error sending message: ${error}`));
        }
    },
};