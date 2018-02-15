const mariadbHandler = require('../handler/mariadbHandler');

exports.run = (client, message, args , logger) => {
    let region = args[0];
    let typeAndsummonerName = args.join(' ').slice(region.length).trim().split(/ +/g);
    let type = typeAndsummonerName[0];
    let summonerName = typeAndsummonerName.join(' ').slice(type.length).trim().split(/ +/g).join(' ');
    type = (type =!!'main');

    mariadbHandler.functions.addLeagueAccount(summonerName.toUpperCase(), region.toUpperCase(), message.author.id, type).then(data => {
        logger.verbose(data);
        message.channel.send(`I added ${summonerName.join(' ').toUpperCase()} [${region.toUpperCase()}] to the database`);
    }).catch(error => {
        logger.verbose(`${error.code} ${error.sqlMessage}`);
    });
};