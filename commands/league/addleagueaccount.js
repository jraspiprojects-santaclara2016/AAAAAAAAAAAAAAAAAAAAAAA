const Discord = require('discord.js');
const mariadbHandler = require('../../handler/mariadbHandler');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'addleagueaccount',
    description: 'Link a LeagueOfLegends account to your Discord account',
    execute(client, message, args) {
        let embed = new Discord.MessageEmbed()
            .setTitle('Add a league account:')
            .addField('Respond with your summoner name!', 'This message timeouts in 10 seconds.')
        ;
        let filter = m => m.author = message.author;
        waitingMessage(client, message, embed, filter);

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

async function waitingMessage(client, message, embed, filter) {
    message.channel.send({ embed });
    let response;
    try {
        response = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 10000,
            errors: ['time'],
        });
    } catch (err) {
        console.error(err);
        return message.channel.send('No or invalid value entered, cancelling volume selection.');
    }
    return response;
}