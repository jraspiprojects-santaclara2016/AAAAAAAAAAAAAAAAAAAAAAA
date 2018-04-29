const Discord = require('discord.js');
const request = require('request');
const configHandler = require('../../handler/util/configHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const apiEndpoint = 'http://api.urbandictionary.com/v0/define?term=';

let generalConfig;

module.exports = {
    name: 'urban',
    description: 'Look something up on Urban Dictionary.',
    disabled: false,
    requireDB: false,
    execute(client, message, args) {
        generalConfig = configHandler.getGeneralConfig();
        request(apiEndpoint + args.join(' '), function(error, response) {
            if(error) return requestError(error, response, message);
            if(response.toJSON().statusCode !== 200) return apiError(error, response, message);
            const responseBody = JSON.parse(response.toJSON().body);
            if(responseBody.result_type === 'no_results') return noResults(error, response, args.join(' '), message);
            logger.silly('Urban: API call successful');
            sendEntry(message, responseBody);
        });
    },
};

function requestError(error, response, message) {
    logger.error(`Urban: Request failed. Error: ${error} Status code: ${response.statusCode}`);
    const embed = new Discord.MessageEmbed()
        .setTitle('FATAL_ERROR:')
        .setColor('DARK_RED')
        .addField('There was an error while processing your request!', 'Please contact the developers and include a screenshot of this error.')
        .setTimestamp()
        .setFooter(`By ${generalConfig.botName}`)
    ;
    message.channel.send(embed).catch(messageError => logger.error(`Urban: Error sending message: ${messageError}`));
}

function apiError(error, response, message) {
    logger.error(`Urban: API call failed. Error: Status code: ${response.statusCode}`);
    const embed = new Discord.MessageEmbed()
        .setTitle('ERROR:')
        .setColor('DARK_RED')
        .addField('HTTP Statuscode:', response.toJSON().statusCode)
        .addField('We could not process the information we got from the API!', 'Please contact the developers if this error pops up after trying the same command again at a later time.')
        .setTimestamp()
        .setFooter(`By ${generalConfig.botName}`)
    ;
    message.channel.send(embed).catch(messageError => logger.error(`Urban: Error sending message: ${messageError}`));
}

function noResults(error, response, searchTerm, message) {
    logger.error(`Urban: No results for ${searchTerm}`);
    const embed = new Discord.MessageEmbed()
        .setTitle('Error:')
        .setColor('DARK_RED')
        .addField('Not found', `We could not find the term: "${searchTerm}" in the Urban Dictionary!`)
        .setTimestamp()
        .setFooter(`By ${generalConfig.botName}`)
    ;
    message.channel.send(embed).catch(messageError => logger.error(`Urban: Error sending message: ${messageError}`));
}

function sendEntry(message, responseBody) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Urban Dictionary:')
        .setColor('DARK_GREEN')
        .addField('Word:', responseBody.list[0].word)
        .addField('Definition:', responseBody.list[0].definition)
        .addField('Tags:', responseBody.tags.join(', '))
        .addField('Rating:', `UP: ${responseBody.list[0].thumbs_up} / DOWN: ${responseBody.list[0].thumbs_down}`)
        .addField('Link:', responseBody.list[0].permalink)
        .setFooter(`By ${responseBody.list[0].author}`)
    ;
    message.channel.send(embed).catch(messageError => logger.error(`Urban: Error sending message: ${messageError}`));
}