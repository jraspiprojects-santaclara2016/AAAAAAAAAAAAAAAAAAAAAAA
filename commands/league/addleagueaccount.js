const Discord = require('discord.js');
const mariadbHandler = require('../../handler/mariadbHandler');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const apiKeys = require('../../configuration/apiKeyConfig');
const lolApi = require('league-api-2.0');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'addleagueaccount',
    description: 'Link a LeagueOfLegends account to your Discord account',
    async execute(client, message) {
        let filter = m => m.author === message.author && m.content !== '';
        let embed = new Discord.MessageEmbed()
            .setTitle('Add a league account:')
            .addField('Respond with your summoner name!', 'This message timeouts in 30 seconds.')
        ;
        let response;
        response = await waitingMessage(client, message, embed, filter);
        const summonerName = response.first().content;
        logger.debug(`Summonername: ${summonerName}`);
        embed = new Discord.MessageEmbed()
            .setTitle('Add a league account:')
            .addField('Respond with your region the account is in!', 'This message timeouts in 30 seconds.')
        ;
        response = await waitingMessage(client, message, embed, filter);
        const region = response.first().content;
        logger.debug(`Region: ${region}`);
        embed = new Discord.MessageEmbed()
            .setTitle('Add a league account:')
            .addField('Is this your main? __y__es or __n__o?', 'This message timeouts in 30 seconds.')
        ;
        filter = m => m.author === message.author && (m.content === 'y' || m.content === 'n');
        response = await waitingMessage(client, message, embed, filter);
        const isMain = response.first().content === 'y';
        logger.debug(`Main: ${isMain}`);
        if(await checkForValidLeagueAccount(summonerName, region)) {
            await insertAccountIntoDatabase(message, summonerName, region, isMain, message.author.id);
        } else {
            message.channel.send('I could not find your league account. Try again!');
        }
    },
};

async function waitingMessage(client, message, embed, filter) {
    message.channel.send({ embed });
    let response;
    try {
        response = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time'],
        });
    } catch (err) {
        console.error(err);
        return message.channel.send('No or invalid value entered, cancelling volume selection.');
    }
    logger.info(response.first().content);
    return response;
}

async function checkForValidLeagueAccount(summonerName, region) {
    lolApi.base.loadConfig('./configuration/lolConfig.json');
    lolApi.base.setKey(apiKeys.leagueOfLegends);
    lolApi.base.setRegion(region);
    lolApi.executeCall('Summoner', 'getSummonerBySummonerName', summonerName, region).then(data => {
        logger.verbose(data);
        return true;
    }).catch(error => {
        logger.error(error);
        return false;
    });
}

async function insertAccountIntoDatabase(message, summonerName, region, type, discordId) {
    summonerName = summonerName.toUpperCase();
    region = region.toUpperCase();
    mariadbHandler.functions.addLeagueAccount(summonerName, region, discordId, type).then(data => {
        logger.verbose(data);
        message.channel.send(`I added ${summonerName.toUpperCase()} [${region.toUpperCase()}] to the database`);
    }).catch(error => {
        logger.error(`${error.code} ${error.sqlMessage}`);
        message.channel.send(`An error occurred while inserting the values to the database! ${error.sqlMessage}`);
    });
}