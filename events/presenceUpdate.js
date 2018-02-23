const winstonLogHandler = require('../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client, oldMember, newMember) => {
    if(!newMember) return;
    const memberId = newMember.user.id;
    if(!newMember.presence) return;
    if(!newMember.presence.activity) return;
    if(newMember.presence.activity.name === 'League of Legends') {
        logger.info('Executing leagueGameInformation');
        const eventFunction = require('../handler/leagueGameInformation');
        eventFunction.run(client, memberId);
    }
};