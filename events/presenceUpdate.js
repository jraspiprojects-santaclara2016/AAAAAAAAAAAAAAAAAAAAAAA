const winstonLogHandler = require('../handler/winstonLogHandler');
const logger = winstonLogHandler.createLogger();
let cacheIdsForBug = [];

exports.run = (client, logger, oldMember, newMember) => {

    if(newMember) {
        let memberId = newMember.user.id;
        if(!cacheIdsForBug.includes(memberId)) {
            cacheIdsForBug.push(memberId);
            logger.info("Added DiscordUserId: " + memberId + " to cache list");
            //TODO change game name
            if(newMember.presence.activity.name === "League of Legends") {
                let eventFunction = require('../handler/leagueGameInformation');
                eventFunction.run(client, logger, memberId);
            }
            setTimeout(function(){
                let index = cacheIdsForBug.indexOf(memberId);
                cacheIdsForBug.splice(index, 1);
                logger.info("Removed DiscordUserId: " + memberId + " from cache list");

            }, 1000 * 2)
        }
    }


};