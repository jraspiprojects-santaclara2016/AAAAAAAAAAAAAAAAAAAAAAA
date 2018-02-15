const mariadbHandler = require('../handler/mariadbHandler');

exports.run = (client, message, args, logger) => {
    mariadbHandler.functions.getLeagueAccounts(message.author.id).then(data => {
        for(let i = 0; i<data.length;i++) {
            message.channel.send(`${data[i].summonerName} ${data[i].region}`);
        }
    }).catch(error => {
        console.log(error);
    });
};