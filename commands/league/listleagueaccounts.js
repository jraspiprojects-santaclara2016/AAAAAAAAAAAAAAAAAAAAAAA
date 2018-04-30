const mariadbHandler = require('../../handler/util/mariadbHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');

module.exports = {
    name: 'listleagueaccounts',
    description: 'List all LeagueOfLegends accounts that are linked with your Discord account.',
    disabled: true,
    requireDB: false,
    execute(client, message) {
        mariadbHandler.functions.getLeagueAccountsOfDiscordId(message.author.id).then(data => {
            logger.silly(`ListLeagueAccounts: Data: \n ${data}`);
            const fields = [];
            for (let i = 0; i < data.length; i++) {
                const field = {};
                field.name = data[i].summonerName;
                field.value = `Region: ${data[i].region}`;
                if (data[i].isMain === 1) {
                    field.value = field.value.concat(' , Main');
                }
                fields.push(field);
            }
            discordCustomEmbedHandler.run(client, 'Your registered League Accounts', fields, message.channel);
        }).catch(error => {
            logger.error(`ListLeagueAccounts: Error retrieving Data from DB: ${error}`);
        });
    },
};