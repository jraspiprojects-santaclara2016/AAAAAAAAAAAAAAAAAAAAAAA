const mariadbHandler = require('./mariadbHandler');
const winstonLogHandler = require('./winstonLogHandler');
const Discord = require('discord.js');
const logger = winstonLogHandler.createLogger();

const lolApi = require('league-api-2.0');

let summonerName;

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
    let discordUser = client.fetch(discordUserId);
    for(embed in embedArray) {
        discordUser.send({embed})
    }
}

function tryOtherAccounts(accountList) {

    let otherAccounts = getAllWithoutMain(accountList);

    callEachAccount(otherAccounts).then(result => {
        if (result != "default") {
            buildEmbeds(result).then(embedArray => {
                sendResult(embedArray);
            })
        } else {
            console.log("No account in game")
            //TODO Error handling no account in game
        }
    });

}

function buildEmbeds(summoners) {
    return new Promise(function (resolve, reject) {
        let array = summoners;
        let embedArray = [];

        for (let i = 0; i < array.length; i++) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(array[i].name);
            embed.setColor(0x00AE86);
            if (array[i].soloQ !== undefined) {
                if (array[i].soloQ.tier === "CHALLENGER") {
                    embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/challenger.png?raw=true')
                }
                else if (array[i].soloQ.tier === "MASTER") {
                    embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/master.png?raw=true')
                }
                else if (array[i].soloQ.tier === "DIAMOND") {
                    embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/diamond.png?raw=true')
                }
                else if (array[i].soloQ.tier === "PLATINUM") {
                    embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/platinum.png?raw=true')
                }
                else if (array[i].soloQ.tier === "GOLD") {
                    embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/gold.png?raw=true')
                }
                else if (array[i].soloQ.tier === "SILVER") {
                    embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/silver.png?raw=true')
                }
                else if (array[i].soloQ.tier === "BRONZE") {
                    embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/bronze.png')
                }
                else {
                    embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/provisional.png?raw=true')
                }

                embed.addField('Solo Q', array[i].soloQ.tier + ' ' + array[i].soloQ.rank)

            } else {
                embed.setThumbnail('https://raw.githubusercontent.com/Zelle97/Discord-Bot/master/tier-icons/base_icons/provisional.png?raw=true')
                embed.addField('Solo Q', 'unranked')
            }

            if (array[i].flexQ !== undefined) {
                embed.addField('Flex Q', array[i].flexQ.tier + ' ' + array[i].flexQ.rank)
            }
            else {
                embed.addField('FlexQ Q', 'unranked')
            }

            /*
             * Takes a Date object, defaults to current date.
             */
            embed.setTimestamp();
            embed.setURL('https://euw.op.gg/summoner/userName=' + encodeURI(array[i].name));

            embedArray[i] = embed;
        }

        resolve(embedArray);
    })
}



exports.run = (client, logger, discordUserId) => {

    mariadbHandler.functions.getLeagueAccountsOfDiscordId(discordUserId).then(accountList => {
        if (!(accountList.length === 0)) {
            let mainAccount = getMain(accountList);
            if (mainAccount) {
                summonerName = mainAccount.summonerName;
                lolApi.executeCall('Special', 'getCurrentGameParticipantElo', summonerName)
                    .then(gameParticipants => {

                    })
                    .catch(error => {
                        if (error.status === 404) {
                            tryOtherAccounts(accountList);
                        } else {
                            console.log("some error")
                            console.log(error);
                            //TODO Error handling
                        }
                    })
            }
        }
    })
};


