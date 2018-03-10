const mariadbHandler = require('../../handler/util/mariadbHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'listleagueaccounts',
    description: 'List all LeagueOfLegends accounts that are linked with your Discord account.',
    disabled: false,
    execute(client, message) {
        mariadbHandler.functions.getLeagueAccountsOfDiscordId(message.author.id).then(data => {
            logger.silly(`ListLeagueAccounts: Data: \n ${data}`);
            for (let i = 0; i < data.length; i++) {
                message.channel.send(`${data[i].summonerName} ${data[i].region} ${data[i].isMain}`).catch(error => logger.error(`ListLeagueAccount: Error sending message: ${error}`));
            }
        }).catch(error => {
            logger.error(`ListLeagueAccounts: Error retrieving Data from DB: ${error}`);
        });
    },
};