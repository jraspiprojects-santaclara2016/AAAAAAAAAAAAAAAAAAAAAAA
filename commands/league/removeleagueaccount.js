const mariadbHandler = require('../../handler/mariadbHandler');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'removeleagueaccount',
    description: 'Delete the link between the LeagueOfLegends and the Discord account',
    execute(client, message, args) {
        mariadbHandler.functions.deleteLeagueAccount(args.join(' ').toUpperCase(), message.author.id).then(data => {
            console.log(data);
            message.channel.send(`I removed ${args.join(' ')} from the database`);
        }).catch(error => {
            logger.error(`removeLeagueAccount: Error while deleting: ${error}`);
        });
    },
};