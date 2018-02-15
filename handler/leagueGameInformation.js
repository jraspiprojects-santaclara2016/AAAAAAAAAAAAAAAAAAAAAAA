const mariadbHandler = require('./mariadbHandler');
const winstonLogHandler = require('./winstonLogHandler');
const logger = winstonLogHandler.createLogger();

const lolApi = require('league-api-2.0');

let summonerName;

async function callEachAccount(accountList) {
    for(account in accountList) {
        let result = await lolApi.executeCall('Special', 'getCurrentGameParticipantElo', account.summonerName);
        if(!result.status) {
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
    return list.filter(function(user){ return user.isMain !== 1;});
}

function filterEnemyTeam(participantList) {
    //TODO Ausgabe

}

function tryOtherAccounts(accountList) {

    let otherAccounts = getAllWithoutMain(accountList);

    callEachAccount(otherAccounts).then(result => {
        if(result != "default") {

        } else {
            //TODO Error handling no account in game
        }
    });

}

exports.run = (client, logger, discordUserId) => {

    mariadbHandler.functions.getLeagueAccountsOfDiscordId(discordUserId).then(accountList => {
        if(!(accountList.length === 0)){
            let mainAccount = getMain(accountList);
            if(mainAccount) {
                summonerName = mainAccount.summonerName;
                lolApi.executeCall('Special', 'getCurrentGameParticipantElo', summonerName)
                    .then(gameParticipants => {

                    })
                    .catch(error => {
                        if(error.status === 404) {
                            tryOtherAccounts(accountList);
                        } else {
                            //TODO Error handling
                        }
                    })
            }
        }
    })
};


