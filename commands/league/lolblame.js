const Discord = require('discord.js');
const config = require('../../configuration/config.json');
const lolApi = require('league-api-2.0');
const leagueBlameHandler = require('../../handler/leaguePostGameStatsHandler');
const discordErrorEmbedHandler = require('../../handler/discordErrorEmbedHandler');
const apiKeys = require('../../configuration/apiKeyConfig');
const accountIdFaker = 3440481;

module.exports = {
    name: 'lolblame',
    description: 'Compare the game data of a filthy casual to Faker',
    execute(client, message, args, logger) {
        lolApi.base.loadConfig('./configuration/lolConfig.json');
        lolApi.base.setKey(apiKeys.leagueOfLegends);
        lolApi.base.setRegion("KR");

        lolApi.executeCall('Special', 'getLastGameOfSummoner', 'Hide on bush').then(matchDataFaker => {
            const pgsFaker = leagueBlameHandler.run(accountIdFaker, matchDataFaker);
            lolApi.base.setRegion('euw1');
            lolApi.executeCall('Special', 'getLastGameOfSummoner', args.join(' ')).then(matchDataBlamed => {
                lolApi.executeCall('Summoner', 'getSummonerBySummonerName', args.join(' ')).then(summonerProfile => {
                    const pgsBlamed = leagueBlameHandler.run(summonerProfile.accountId, matchDataBlamed);
                    console.log(pgsBlamed.general.gameTime);
                    console.log(pgsFaker.general.gameTime);
                    const embed = new Discord.MessageEmbed()
                        .setColor('DARK_GREEN')
                        .addField('Game comparison with Faker:', `Faker / ${args.join(' ')}`)
                        .addField('Win', `${pgsFaker.general.win} / ${pgsBlamed.general.win}`)
                        .addField('Kills', `${pgsFaker.general.kills} / ${pgsBlamed.general.kills}`)
                        .addField('Deaths', `${pgsFaker.general.deaths} / ${pgsBlamed.general.deaths}`)
                        .addField('Assists', `${pgsFaker.general.assists} / ${pgsBlamed.general.assists}`)
                        .addField('Gold/min', `${Math.round(pgsFaker.gold.goldEarned / (pgsFaker.general.gameTime / 60))} / ${Math.round(pgsBlamed.gold.goldEarned / (pgsBlamed.general.gameTime / 60))}`)
                        .addField('Minions/min', `${Math.round((pgsFaker.killStats.totalMinionsKilled + pgsFaker.killStats.neutralMinionsKilled) / (pgsFaker.general.gameTime / 60))} / ${Math.round((pgsBlamed.killStats.totalMinionsKilled + pgsBlamed.killStats.neutralMinionsKilled) / (pgsBlamed.general.gameTime / 60))}`)
                        .setFooter(`Data obtained by ${config.botName} from "RIOT" API`)
                        .setTimestamp()
                    ;
                    message.channel.send({ embed }).catch(error => {console.log(error)});
                }).catch(error => {
                    discordErrorEmbedHandler.run(client, message, `Couldn't request the summoner profile of summoner: "${args.join(' ')}"`);
                });
            }).catch(error => {
                discordErrorEmbedHandler.run(client, message, `Couldn't request the match history of summoner: "${args.join(' ')}"`);
            });
        }).catch(error => {
            console.log(error);
        });
    },
};