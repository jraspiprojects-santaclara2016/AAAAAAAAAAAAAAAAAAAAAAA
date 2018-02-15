const Discord = require('discord.js');
const config = require('../configuration/config');
const lolApi = require('league-api-2.0');

exports.run = (client, message, args, logger) => {
    lolApi.base.loadConfig('./configuration/lolConfig.json');
    lolApi.base.setKey(process.env.LOL_TOKEN);
    lolApi.base.setRegion("euw1");

    logger.debug('Trying to execute lol api getSummonerBySummonerName call');
    lolApi.executeCall("Summoner","getSummonerBySummonerName",args.join(' ')).then((responseSummoner) => {
        logger.debug('lol api getSummonerBySummonerName call executed successfully');
        logger.silly(responseSummoner);
        let embed = new Discord.MessageEmbed()
            .setTitle('Lolinfo command:')
            .setColor('DARK_GREEN')
            .setThumbnail('http://avatar.leagueoflegends.com/euw/'+ args.join('%20') +'.png')
            .addField('SummonerName',responseSummoner.name)
            .addField('Summonerlevel',responseSummoner.summonerLevel)
            .addField('AccountID', responseSummoner.accountId)
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        logger.debug('Trying to execute lol api getEloOfSummonerName call');
            lolApi.executeCall("Special","getEloOfSummonerName",args.join(' ')).then((response) => {
                logger.debug('lol api getEloOfSummonerName call executed successfully');
                logger.silly(response);
                for(let i = 0; i<response.length;i++) {
                    embed.addField(response[i].queueType, response[i].leagueName + ' ' + response[i].tier + ' ' +
                        response[i].rank + ' | ' + response[i].leaguePoints + 'LP | Wins:' +
                        response[i].wins + ' | Losses: ' +response[i].losses);
                }
                message.channel.send({embed});
            }).catch((error) => {

            });
        }).catch((error) => {
            console.error(error);
        })
};