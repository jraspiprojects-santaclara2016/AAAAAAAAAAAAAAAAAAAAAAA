const Discord = require('discord.js');
const lolApi = require('league-api-2.0');
const config = require('../../configuration/config');
const apiKeys = require('../../configuration/apiKeyConfig');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'lolstatus',
    description: 'Display the current status of the LeagueOfLegends server.',
    execute(client, message, args) {
        lolApi.base.loadConfig('./configuration/lolConfig.json');
        lolApi.base.setKey(apiKeys.leagueOfLegends);
        lolApi.base.setRegion(args[0]);
        lolApi.executeCall('Status', 'getLolStatus').then((response) => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Lolstatus command:')
                .setColor('DARK_GREEN')
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            logger.silly(response);
            for(let i = 0; i < response.services.length; i++) {
                for(let j = 0; j < response.services[i].incidents.length; j++) {
                    embed.addField(response.services[i].name, response.services[i].incidents[j].updates[0].content);
                }
            }
            message.channel.send({ embed });
        }).catch((error) => {
            logger.error(error);
        });
    },
};