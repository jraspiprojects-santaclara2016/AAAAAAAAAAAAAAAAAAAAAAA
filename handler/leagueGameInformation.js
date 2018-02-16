const mariadbHandler = require('./mariadbHandler');
const winstonLogHandler = require('./winstonLogHandler');
const Discord = require('discord.js');
const logger = winstonLogHandler.createLogger();

const lolApi = require('league-api-2.0');

const tierIconURL = 'https://raw.githubusercontent.com/RiotAPI/Riot-Games-API-Developer-Assets/master/tier-icons/tier-icons-base/';

let summonerNameObj;
let clientObj;
let discordUserIdObj;

exports.run = (client, logger, discordUserId) => {

    console.log("Executing function");

    clientObj = client;
    discordUserIdObj = discordUserId;

    lolApi.base.loadConfig('./configuration/lolConfig.json');
    lolApi.base.setKey(process.env.LOL_TOKEN);
    lolApi.base.setRegion("EUW1");

    mariadbHandler.functions.getLeagueAccountsOfDiscordId(discordUserId).then(accountList => {
        if (!(accountList.length === 0)) {
            let mainAccount = getMain(accountList);
            if (mainAccount) {
                summonerNameObj = mainAccount.summonerName;
                //TODO testing
                lolApi.executeCall('Special', 'getCurrentGameParticipantElo', 'DeezZ NuTts xD')
                    .then(gameParticipants => {
                        buildEmbeds((gameParticipants)).then(embedArray => {
                            sendResult((embedArray));
                        })
                    })
                    .catch(error => {
                        if (error.status === 404) {
                            tryOtherAccounts(accountList);
                        } else {
                            console.log("some error");
                            console.log(error);
                            //TODO Error handling
                        }
                    })
            }
        }
    })
};

async function callEachAccount(accountList) {
    for (account in accountList) {
        let result = await lolApi.executeCall('Special', 'getCurrentGameParticipantElo', account.summonerName);
        if (!result.status) {
            return result;
        }
    }

    //TODO default value
    return "default";
}

function getMain(list) {
    return list.find(summonerNames => summonerNames.isMain === 1);
}

function getAllWithoutMain(list) {
    return list.filter(function (user) {
        return user.isMain !== 1;
    });
}

function sendResult(embedArray) {
    clientObj.users.fetch(discordUserIdObj).then(discordUser => {
        for (embed of embedArray) {
            discordUser.send({embed});
        }
    });
}

function tryOtherAccounts(accountList) {

    let otherAccounts = getAllWithoutMain(accountList);

    callEachAccount(otherAccounts).then(result => {
        if (result !== "default") {
            buildEmbeds(result).then(embedArray => {
                sendResult(embedArray);
            });
        } else {
            console.log("No account in game")
            //TODO Error handling no account in game
        }
    });

}

function buildEmbeds(summoners) {
    return new Promise(function (resolve) {
        console.log(summoners);
        let promiseArray = [];
        for (summoner of summoners) {
            promiseArray.push(buildEmbedForSummoner(summoner));
        }
        Promise.all(promiseArray).then(embeds => {
            resolve(embeds);
        })
    })
}

function buildEmbedForSummoner(summoner) {
    return new Promise(function (resolve, reject) {
        let embed = new Discord.MessageEmbed();
        embed.setTitle(summoner.SummonerName);
        embed.setColor('DARK_GREEN');
        embed.setTimestamp();
        embed.setURL('https://euw.op.gg/summoner/userName=' + encodeURI(summoner.SummonerName));

        if (summoner.SummonerElo.length === 0) {
            embed.setThumbnail(tierIconURL + 'provisional.png');
            embed.addField('All Queues', 'unranked');
            resolve(embed);
        }

        for (elo of summoner.SummonerElo) {
            if (elo.queueType === 'RANKED_FLEX_SR') {
                embed.addField('Flex Q', elo.tier + ' ' + elo.rank);
            } else if (elo.queueType === 'RANKED_SOLO_5x5') {
                switch (elo.tier) {
                    case 'BRONZE':
                        embed.setThumbnail(tierIconURL + 'bronze.png');
                        embed.addField('Solo Q', elo.tier + ' ' + elo.rank);
                        break;
                    case 'SILVER':
                        embed.setThumbnail(tierIconURL + 'silver.png');
                        embed.addField('Solo Q', elo.tier + ' ' + elo.rank);
                        break;
                    case 'GOLD':
                        embed.setThumbnail(tierIconURL + 'gold.png');
                        embed.addField('Solo Q', elo.tier + ' ' + elo.rank);
                        break;
                    case 'PLATINUM':
                        embed.setThumbnail(tierIconURL + 'platinum.png');
                        embed.addField('Solo Q', elo.tier + ' ' + elo.rank);
                        break;
                    case 'DIAMOND':
                        embed.setThumbnail(tierIconURL + 'diamond.png');
                        embed.addField('Solo Q', elo.tier + ' ' + elo.rank);
                        break;
                    case 'MASTER':
                        embed.setThumbnail(tierIconURL + 'master.png');
                        embed.addField('Solo Q', elo.tier + ' ' + elo.rank);
                        break;
                    case 'CHALLENGER':
                        embed.setThumbnail(tierIconURL + 'challenger.png');
                        embed.addField('Solo Q', elo.tier + ' ' + elo.rank);
                        break;
                    default:
                        embed.setThumbnail(tierIconURL + 'provisional.png');
                        embed.addField('Solo Q', 'unranked');
                }
            }
        }
        resolve(embed);
    });
}




