const Discord = require('discord.js');
const config = require('../configuration/config.json');

exports.run = (client, message, args) => {
    let flip = Math.round(Math.random());
    if(flip === 0) {
        let embed = new Discord.RichEmbed()
            .setTitle('Coinflip Command:')
            .setColor('DARK_GREEN')
            .setImage('https://www.random.org/coins/faces/60-eur/germany-1euro/obverse.jpg')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({embed}).catch(console.error);
    } else {
        let embed = new Discord.RichEmbed()
            .setTitle('Coinflip Command:')
            .setColor('DARK_GREEN')
            .setImage('https://www.random.org/coins/faces/60-eur/germany-1euro/reverse.jpg')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({embed}).catch(console.error);
    }
};