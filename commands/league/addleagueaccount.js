const Discord = require('discord.js');
const mariadbHandler = require('../../handler/mariadbHandler');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'addleagueaccount',
    description: 'Link a LeagueOfLegends account to your Discord account',
    async execute(client, message) {
        let embed = new Discord.MessageEmbed()
            .setTitle('Add a league account:')
            .addField('Respond with your summoner name!', 'This message timeouts in 20 seconds.')
        ;
        let response;
        response = await waitingMessage(client, message, embed);
        const summonerName = response.first().content;
        message.channel.send(`Summonername: ${summonerName}`);
        embed = new Discord.MessageEmbed()
            .setTitle('Add a league account:')
            .addField('Respond with your region the account is in!', 'This message timeouts in 20 seconds.')
        ;
        response = await waitingMessage(client, message, embed);
        const region = response.first().content;
        message.channel.send(`Region: ${region}`);
        embed = new Discord.MessageEmbed()
            .setTitle('Add a league account:')
            .addField('Is this your main? __y__es or __n__o?', 'This message timeouts in 20 seconds.')
        ;
        response = await waitingMessage(client, message, embed);
        const isMain = response.first().content === 'y';
        message.channel.send(`Main: ${isMain}`);
        // TODO add API check if account exists!
        await insertAccountIntoDatabase(message, summonerName, region, isMain, message.author.id);
    },
};

async function waitingMessage(client, message, embed) {
    message.channel.send({ embed });
    let response;
    try {
        response = await message.channel.awaitMessages(m => m.author === message.author && m.content !== '', {
            max: 1,
            time: 20000,
            errors: ['time'],
        });
    } catch (err) {
        console.error(err);
        return message.channel.send('No or invalid value entered, cancelling volume selection.');
    }
    logger.info(response.first().content);
    return response;
}

async function insertAccountIntoDatabase(message, summonerName, region, type, discordId) {
    mariadbHandler.functions.addLeagueAccount(summonerName.toUpperCase(), region.toUpperCase(), discordId, type).then(data => {
        logger.verbose(data);
        message.channel.send(`I added ${summonerName.toUpperCase()} [${region.toUpperCase()}] to the database`);
    }).catch(error => {
        logger.verbose(`${error.code} ${error.sqlMessage}`);
        message.channel.send(`An error occurred while inserting the values to the database! ${error.sqlMessage}`);
    });
}