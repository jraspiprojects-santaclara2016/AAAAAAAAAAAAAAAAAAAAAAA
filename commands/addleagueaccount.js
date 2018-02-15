const mariadbHandler = require('../handler/mariadbHandler');

exports.run = (client, message, args , logger) => {
    let region = args[0];
    let summonerName = args.join(' ').slice(region.length).trim().split(/ +/g);
    mariadbHandler.functions.addLeagueAccount(summonerName.join(' ').toUpperCase(), region.toUpperCase(), message.author.id).then(data => {
        logger.verbose(data);
        message.channel.send(`I added ${summonerName.join(' ').toUpperCase()} [${region.toUpperCase()}] to the database`);
    }).catch(error => {
        logger.verbose(`${error.code} ${error.sqlMessage}`);
    });
};