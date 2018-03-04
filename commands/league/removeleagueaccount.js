const mariadbHandler = require('../../handler/util/mariadbHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'removeleagueaccount',
    description: 'Delete the link between the LeagueOfLegends and the Discord account',
    execute(client, message, args) {
        mariadbHandler.functions.deleteLeagueAccount(args.join(' ').toUpperCase(), message.author.id).then(data => {
            logger.silly(`RemoveLagueAccount: Result from DB: ${data}`);
            message.channel.send(`I removed ${args.join(' ')} from the database`).catch(error => logger.error(`RemoveLeagueAccount: Error sending message ${error}`));
        }).catch(error => {
            logger.error(`RemoveLagueAccount: Error while deleting: ${error}`);
        });
    },
};