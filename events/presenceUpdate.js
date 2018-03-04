const winstonLogHandler = require('../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

exports.run = (client, oldMember, newMember) => {
    if (!newMember) return;
    const memberId = newMember.user.id;
    if (!newMember.presence) return;
    if (!newMember.presence.activity) return;
    if (newMember.presence.activity.name === 'League of Legends') {
        logger.info('Presemce: Executing leagueGameInformation');
        const eventFunction = require('../handler/command/leagueGameInformation');
        eventFunction.run(client, memberId);
    }
};