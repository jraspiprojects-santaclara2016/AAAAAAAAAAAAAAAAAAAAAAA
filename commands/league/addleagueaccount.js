const mariadbHandler = require('../../handler/mariadbHandler');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'addleagueaccount',
    description: 'Link a LeagueOfLegends account to your Discord account',
    execute(client, message, args) {
        const region = args[0];
        const typeAndSummonerName = args.join(' ').slice(region.length).trim().split(/ +/g);
        let type = typeAndSummonerName[0];
        const summonerName = typeAndSummonerName.join(' ').slice(type.length).trim().split(/ +/g).join(' ');
        type = type.toLowerCase();
        type = (type === 'main');

        mariadbHandler.functions.addLeagueAccount(summonerName.toUpperCase(), region.toUpperCase(), message.author.id, type).then(data => {
            logger.verbose(data);
            message.channel.send(`I added ${summonerName.toUpperCase()} [${region.toUpperCase()}] to the database`);
        }).catch(error => {
            logger.verbose(`${error.code} ${error.sqlMessage}`);
        });
    },
};