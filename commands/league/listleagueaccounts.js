const mariadbHandler = require('../../handler/mariadbHandler');

module.exports = {
    name: 'listleagueaccounts',
    description: 'List all LeagueOfLegends accounts that are linked with your Discord account.',
    execute(client, message, args, logger) {
        mariadbHandler.functions.getLeagueAccounts(message.author.id).then(data => {
            for(let i = 0; i < data.length;i++) {
                message.channel.send(`${data[i].summonerName} ${data[i].region} ${data[i].isMain}`);
            }
        }).catch(error => {
            console.log(error);
        });
    },
};