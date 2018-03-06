const Discord = require('discord.js');
const request = require('request');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const apiEndpoint = 'http://api.urbandictionary.com/v0/define?term=';

module.exports = {
    name: 'urban',
    description: 'Look something up on Urban Dictionary.',
    execute(client, message, args) {
        request(apiEndpoint + args.join(' '), function(error, response, body) {
            if (!error || !response.statusCode === 200) {
                const jsonResponse = JSON.parse(body);
                logger.silly('Urban: API call successful');
                const embed = new Discord.MessageEmbed()
                    .setTitle('Urban Dictionary:')
                    .setColor('DARK_GREEN')
                    .addField('Word:', jsonResponse.list[0].word)
                    .addField('Definition:', jsonResponse.list[0].definition)
                    .addField('Tags:', jsonResponse.tags.join(', '))
                    .addField('Rating:', `UP: ${jsonResponse.list[0].thumbs_up} / DOWN: ${jsonResponse.list[0].thumbs_down}`)
                    .addField('Link:', jsonResponse.list[0].permalink)
                    .setFooter(`By ${jsonResponse.list[0].author}`)
                ;
                message.channel.send({ embed }).catch(messageError => logger.error(`Urban: Error sending message: ${messageError}`));
            } else {
                logger.error(`Urban: API call failed. Error: ${error} \n Status code: ${response.statusCode}`);
            }
        });
    },
};