
exports.run = (accountId, matchData, ) => {
    //League post game stats object!
    let lpgs = {
        'general' : {
            'gameMode' : undefined,
            'gameType' : undefined,
            'gameTime' : undefined,
            'win' : undefined,
            'kills' : undefined,
            'deaths' : undefined,
            'assists' : undefined,
        },
        'items' : {
            'item0' : undefined,
            'item1' : undefined,
            'item2' : undefined,
            'item3' : undefined,
            'item4' : undefined,
            'item5' : undefined,
            'item6' : undefined,

        },
        'killStats' : {
            'largestKillingSpree': undefined,
            'largestMultiKill': undefined,
            'killingSprees': undefined,
            'longestTimeSpentLiving': undefined,
            'doubleKills': undefined,
            'tripleKills': undefined,
            'quadraKills': undefined,
            'pentaKills': undefined,
            'unrealKills': undefined,
            'totalMinionsKilled': undefined,
            'neutralMinionsKilled': undefined,
            'neutralMinionsKilledTeamJungle': undefined,
            'neutralMinionsKilledEnemyJungle': undefined,
        },
        'gold' : {
            'goldEarned': undefined,
            'goldSpent': undefined,
        },
        'damage' : {
            'totalDamageDealt': undefined,
            'magicDamageDealt': undefined,
            'physicalDamageDealt': undefined,
            'trueDamageDealt': undefined,
            'largestCriticalStrike': undefined,
            'totalDamageDealtToChampions': undefined,
            'magicDamageDealtToChampions': undefined,
            'physicalDamageDealtToChampions': undefined,
            'trueDamageDealtToChampions': undefined,
            'totalHeal': undefined,
            'damageSelfMitigated': undefined,
            'damageDealtToObjectives': undefined,
            'damageDealtToTurrets': undefined,
        },
        'vision' : {
            'visionScore' : undefined,
            'visionWardsBoughtInGame': undefined,
            'sightWardsBoughtInGame': undefined,
            'wardsPlaced': undefined,
            'wardsKilled': undefined,
        },
    };
    let participantID = 0;
    console.log(accountId);
    for(let i = 0; i< matchData.participantIdentities.length ; i++) {
        console.log(matchData.participantIdentities[i].player.accountId);
        if(matchData.participantIdentities[i].player.accountId === accountId) {
            participantID = i;
            break;
        }
    }
    console.log(participantID);

    lpgs.general.gameMode = matchData.gameMode;
    lpgs.general.gameType = matchData.gameType;
    lpgs.general.gameTime = matchData.gameDuration;
    lpgs.general.win = matchData.participants[participantID].stats.win;
    lpgs.general.kills = matchData.participants[participantID].stats.kills;
    lpgs.general.deaths = matchData.participants[participantID].stats.deaths;
    lpgs.general.assists = matchData.participants[participantID].stats.assists;

    lpgs.items.item0 = matchData.participants[participantID].stats.item0;
    lpgs.items.item1 = matchData.participants[participantID].stats.item1;
    lpgs.items.item2 = matchData.participants[participantID].stats.item2;
    lpgs.items.item3 = matchData.participants[participantID].stats.item3;
    lpgs.items.item4 = matchData.participants[participantID].stats.item4;
    lpgs.items.item5 = matchData.participants[participantID].stats.item5;
    lpgs.items.item6 = matchData.participants[participantID].stats.item6;

    lpgs.killStats.largestKillingSpree = matchData.participants[participantID].stats.largestKillingSpree;
    lpgs.killStats.largestMultiKill = matchData.participants[participantID].stats.largestMultiKill;
    lpgs.killStats.totalMinionsKilled = matchData.participants[participantID].stats.totalMinionsKilled;
    lpgs.killStats.neutralMinionsKilled = matchData.participants[participantID].stats.neutralMinionsKilled;

    lpgs.gold.goldEarned = matchData.participants[participantID].stats.goldEarned;
    lpgs.gold.goldSpent = matchData.participants[participantID].stats.goldSpent;
    return lpgs;
};