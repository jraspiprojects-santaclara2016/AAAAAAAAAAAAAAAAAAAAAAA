const Discord = require('discord.js');
const lolApi = require('league-api-2.0');
const config = require('../configuration/config.json');

exports.run = (client, message, args, logger) => {
    lolApi.base.loadConfig('../../configuration/lolConfig.json');
    lolApi.base.setKey(process.env.LOL_TOKEN);
    lolApi.base.setRegion("euw1");
    lolApi.executeCall("Status","getLolStatus").then((response) => {
        let embed = new Discord.RichEmbed()
            .setTitle('Lolstatus command:')
            .setColor('DARK_GREEN')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        logger.silly(response);
        for(let i = 0; i < response.services.length; i++) {
            for(let j = 0; j < response.services[i].incidents.length; j++) {
                embed.addField(response.services[i].name, response.services[i].incidents[j].updates[0].content)
            }
        }
        message.channel.send({embed});
    }).catch((error) => {
        logger.error(error);
    });
};