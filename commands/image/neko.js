const Discord = require('discord.js');
const request = require('request');

const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.createLogger();

module.exports = {
    name: 'neko',
    description: 'Display a random neko image.',
    execute(client, message) {
        request.get('https://nekos.brussell.me/api/v1/random/image', {
            qs: {
                count: 1,
                nsfw: message.channel.nsfw,
            },
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const json = JSON.parse(body);
                const embed = new Discord.MessageEmbed()
                    .setTitle('random neko image')
                    .addField('ID:', json.images[0].id)
                    .addField('Link', `https://nekos.brussell.me/image/${json.images[0].id}`)
                    .setTimestamp()
                    .setImage(`https://nekos.brussell.me/image/${json.images[0].id}`)
                    .setFooter('Artist: ' + json.images[0].artist)
                ;
                message.channel.send(embed).catch(messageError => logger.error(`neko: Error sending message: ${messageError}`));
            }
        });
    },
};