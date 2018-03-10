const Discord = require('discord.js');
const request = require('request');
const apiKeys = require('../../configuration/apiKeyConfig');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

const errorEmbedHandler = require('../../handler/command/discordErrorEmbedHandler');

module.exports = {
    name: 'weather',
    description: 'Display the current weather of a specified location.',
    disabled: false,
    execute(client, message, args) {
        if (args.length >= 1) {
            request.get('https://api.openweathermap.org/data/2.5/weather', {
                qs: {
                    q: args.join(' '),
                    appid: apiKeys.openWeatherMap,
                    units: 'metric',
                    lang: 'en',
                },
            }, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const jsonResponse = JSON.parse(body);
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Weather command:')
                        .setThumbnail(`https://openweathermap.org/img/w/${jsonResponse.weather[0].icon}.png`)
                        .addField('Location:', `${jsonResponse.name} (${jsonResponse.sys.country})`)
                        .addField('Condition:', jsonResponse.weather[0].description)
                        .addField('Temperature (min/max):', `${jsonResponse.main.temp_min}°C / ${jsonResponse.main.temp_max}°C`)
                        .addField('Wind speed:', `${jsonResponse.wind.speed} m/s`)
                        .setTimestamp()
                        .setFooter('Data from OpenWeatherMap')
                    ;
                    message.channel.send(embed).catch(messageError => logger.error(`Weather: Error sending message: ${messageError}`));
                } else {
                    if (!(response.statusCode === 404)) logger.error(`weather: Error: ${error}`);
                    errorEmbedHandler.run(client, message, 'I haven\'t found any city that matches your input.');
                }
            });
        } else {
            errorEmbedHandler.run(client, message, 'The structure of the command was wrong!');
        }
    },
};