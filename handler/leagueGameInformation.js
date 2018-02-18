const mariadbHandler = require('./mariadbHandler');
const winstonLogHandler = require('./winstonLogHandler');
const Discord = require('discord.js');
const logger = winstonLogHandler.createLogger();

const lolApi = require('league-api-2.0');
const debugHook = new Discord.WebhookClient(process.env.DEBUG_WEBHOOK_ID, process.env.DEBUG_WEBHOOK_TOKEN);

const tierIconURL = 'https://raw.githubusercontent.com/RiotAPI/Riot-Games-API-Developer-Assets/master/tier-icons/tier-icons-base/';

let summonerNameObj;
let clientObj;
let discordUserIdObj;

exports.run = (client, logger, discordUserId) => {

    clientObj = client;
    discordUserIdObj = discordUserId;

    lolApi.base.loadConfig('./configuration/lolConfig.json');
    lolApi.base.setKey(process.env.LOL_TOKEN);
    lolApi.base.setRegion("EUW1");

    checkLiveGameFlag().then(() => {
        mariadbHandler.functions.getLeagueAccountsOfDiscordId(discordUserId).then(accountList => {
            if (!(accountList.length === 0)) {
                let mainAccount = getMain(accountList);
                if (mainAccount) {
                    logger.info("leagueGameInformation: User found in DB and requesting game data...");
                    summonerNameObj = mainAccount.summonerName;
                    lolApi.executeCall('Special', 'getCurrentGameParticipantElo', summonerNameObj)
                        .then(gameParticipants => {
                            buildEmbeds((gameParticipants)).then(embedArray => {
                                sendResult((embedArray));
                            })
                        })
                        .catch(error => {
                            if (error.status === 404) {
                                logger.debug("leagueGameInformation: League Account: " + summonerNameObj + " not in Game. Trying next...")
                                tryOtherAccounts(accountList);
                            } else {
                                logger.error("leagueGameInformation: Error requesting game information. Status: " + error.status + " Message: " + error.message);
                            }
                        })
                } else {
                    tryOtherAccounts(accountList);
                }
            }
        })
    });
};

async function checkLiveGameFlag() {
    let resultList = await mariadbHandler.functions.getEnableLiveGameStatsForDiscordId(discordUserIdObj);
    for (let item of resultList) {
        if (item.enableLiveGameStats === 0) {
            return;
        }
    }
}

function buildEmbeds(summoners) {
    return new Promise(function (resolve) {
        let promiseArray = [];
        for (let summoner of summoners) {
            promiseArray.push(buildEmbedForSummoner(summoner));
        }
        Promise.all(promiseArray).then(embeds => {
            resolve(embeds);
        })
    })
}

function sendResult(embedArray) {
    for (let embed of embedArray) {
        debugHook.send({embed}).catch(error => {
            logger.error("leagueGameInformation: Error sending Embed to User. Error: " + error);
        });
    }
    logger.info("leagueGameInformation: Embeds send to DiscordUser")
    //TODO replace with actual UserId ( discordUserIdObj ). Current is zelles id
    /*    clientObj.users.fetch(discordUserIdObj).then(discordUser => {
            for (let embed of embedArray) {
                discordUser.send({embed}).catch(error => {
                    logger.error("leagueGameInformation: Error sending Embed to User. Error: " + error);
                });
            }
        });*/
}

function tryOtherAccounts(accountList) {
    let otherAccounts = getAllWithoutMain(accountList);
    callEachAccount(otherAccounts).then(result => {
        if (result !== "default") {
            buildEmbeds(result).then(embedArray => {
                sendResult(embedArray);
            });
        } else {
            logger.info("leagueGameInformation: No Account for User with discordId: " + discordUserIdObj + " in-game!");
        }
    });
}

async function callEachAccount(accountList) {
    for (let account of accountList) {
        try {
            return await lolApi.executeCall('Special', 'getCurrentGameParticipantElo', 'Edlbert');
        } catch (error) {
            if (error.status === 404) {
                logger.debug("leagueGameInformation: League Account: " + account.summonerName + " not in Game. Trying next...");
                tryOtherAccounts(accountList);
            } else {
                logger.error("leagueGameInformation: Error requesting game information. Status: " + error.status + " Message: " + error.message);
            }
        }
    }
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

function buildEmbedForSummoner(summoner) {
    return new Promise(function (resolve) {
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

        for (let elo of summoner.SummonerElo) {
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




