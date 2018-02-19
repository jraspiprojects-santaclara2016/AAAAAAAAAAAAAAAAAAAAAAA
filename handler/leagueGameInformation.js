const Discord = require('discord.js');
const lolApi = require('league-api-2.0');

const logger = winstonLogHandler.getLogger();
const mariadbHandler = require('./mariadbHandler');
const winstonLogHandler = require('./winstonLogHandler');

//TODO remove webhook if prod
const debugHook = new Discord.WebhookClient(process.env.DEBUG_WEBHOOK_ID, process.env.DEBUG_WEBHOOK_TOKEN);
const tierIconURL = 'https://raw.githubusercontent.com/RiotAPI/Riot-Games-API-Developer-Assets/master/tier-icons/tier-icons-base/';


exports.run = (client, logger, discordUserId) => {
    lolApi.base.loadConfig('./configuration/lolConfig.json');
    lolApi.base.setKey(process.env.LOL_TOKEN);

    //TODO Region of User from DB
    lolApi.base.setRegion("EUW1");

    logger.info("leagueGameInformation: Requesting Data...");
    main(client, discordUserId).then(response => {
        if (response) {
            logger.info("leagueGameInformation: Successful!");
        } else {
            logger.info("leagueGameInformation: Aborted!");
        }
    });
};

async function main(client, discordUserId) {
    if (!await isFlagEnabled(discordUserId)) {
        logger.error("leagueGameInformation: EnableLiveGameStats is not enabled for User with discordId: " + discordUserId);
        return false;
    }
    let accounts = await getAccounts(discordUserId);
    if (!(accounts.length === 0)) {
        let mainAccount = getMain(accounts);
        let result;
        if (mainAccount) {
            result = await handleMainAccount(mainAccount, accounts);
        } else {
            result = await tryOtherAccounts(accounts);
        }
        if (result) {
            let message = await buildEmbed(result);
            await sendResult(client, message);
            return true;
        } else {
            logger.info("leagueGameInformation: No Account for User with discordId: " + discordUserId + " in-game!")
            return false;
        }
    } else {
        logger.info("leagueGameInformation: No Accounts found for User with discordId: " + discordUserId);
        return false;
    }
}

async function handleMainAccount(mainAccount, accounts) {
    let result;
    try {
        result = await lolApi.executeCall('Special', 'getCurrentGameParticipantElo', mainAccount.summonerName);
    } catch (error) {
        if (error.status === 404) {
            logger.debug("leagueGameInformation: League Account: " + mainAccount.summonerName + " not in Game. Trying next...");
            result = await tryOtherAccounts(accounts);
        } else {
            logger.error("leagueGameInformation: Error requesting game information. Status: " + error.status + " Message: " + error.message);
        }
    }
    return result;
}

async function buildEmbed(result) {
    //TODO build embed
    console.log(result);
}

async function sendResult(client, message) {
    //TODO replace with actual UserId ( discordUserIdObj ). Current is debug channel on Monika Bot server
    try {
        await debugHook.send({message});
    } catch (error) {
        logger.error("leagueGameInformation: Error sending Embed to User. Error: " + error);
    }
}

async function tryOtherAccounts(accountList) {
    let otherAccounts = getAllWithoutMain(accountList);
    let result = await callEachAccount(otherAccounts);
    if (result !== "default") {
        return result;
    }
}

async function callEachAccount(accountList) {
    for (let account of accountList) {
        try {
            return await lolApi.executeCall('Special', 'getCurrentGameParticipantElo', account.summonerName);
        } catch (error) {
            if (error.status === 404) {
                logger.debug("leagueGameInformation: League Account: " + account.summonerName + " not in Game. Trying next...");
            } else {
                logger.error("leagueGameInformation: Error requesting game information. Status: " + error.status + " Message: " + error.message);
            }
        }
    }
    return "default";
}

async function isFlagEnabled(discordUserId) {
    let resultList = await mariadbHandler.functions.getEnableLiveGameStatsForDiscordId(discordUserId);
    for (let item of resultList) {
        if (item.enableLiveGameStats === 0) {
            return false;
        }
    }
    return true;
}

async function getAccounts(discordUserId) {
    let accounts;
    try {
        accounts = await mariadbHandler.functions.getLeagueAccountsOfDiscordId(discordUserId);
    } catch (error) {
        logger.error("leagueGameInformation: Error requesting accounts from DB. Error: " + error);
    }
    return accounts;
}

function getMain(list) {
    return list.find(summonerNames => summonerNames.isMain === 1);
}

function getAllWithoutMain(list) {
    return list.filter(function (user) {
        return user.isMain !== 1;
    });
}


/*

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


//All Info in one single Embed
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

*/



