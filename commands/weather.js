const Discord = require('discord.js');
const request = require('request');

const errorEmbedHandler = require('../handler/discordErrorEmbedHandler');

exports.run = (client, message, args, logger) => {
    if(args.length >= 1) {
        request.get('https://api.openweathermap.org/data/2.5/weather', {
            qs: {
                q :args.join(' '),
                appid : process.env.OPENWEATHERMAP_TOKEN,
                units : 'metric',
                lang : 'en',
            }
        },function (error, response, body) {
            if(!error && response.statusCode === 200) {
                let jsonResponse = JSON.parse(body);
                let embed = new Discord.MessageEmbed()
                    .setTitle('Weather command:')
                    .setThumbnail(`https://openweathermap.org/img/w/${jsonResponse.weather[0].icon}.png`)
                    .addField('Location:', `${jsonResponse.name} (${jsonResponse.sys.country})`)
                    .addField('Condition:',jsonResponse.weather[0].description)
                    .addField('Temperature (min/max):',`${jsonResponse.main.temp_min}°C / ${jsonResponse.main.temp_max}°C`)
                    .addField('Wind speed:',`${jsonResponse.wind.speed} m/s`)
                    .setTimestamp()
                    .setFooter('Data from OpenWeatherMap')
                ;
                message.channel.send({embed});
            } else {
                errorEmbedHandler.run(client, message, 'I haven\'t found any city that matches your input.')
            }
        });
    } else {
        errorEmbedHandler.run(client, message, 'The structure of the command was wrong!');
    }
};