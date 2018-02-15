const mariadbHandler = require('../handler/mariadbHandler');

exports.run = (client, message, args, logger) => {
    mariadbHandler.functions.getLeagueAccountsOfDiscordId(message.author.id).then(data => {
        for(let i = 0; i<data.length;i++) {
            message.channel.send(`${data[i].summonerName} ${data[i].region} ${data[i].isMain}`);
        }
    }).catch(error => {
        console.log(error);
    });
};