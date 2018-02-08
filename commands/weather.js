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
                let json = JSON.parse(body);
                let embed = new Discord.RichEmbed()
                    .setTitle('Weather command:')
                    .setThumbnail('https://openweathermap.org/img/w/' + json.weather[0].icon + '.png')
                    .addField('Location:',json.name + '('+ json.sys.country +')')
                    .addField('Condition:',json.weather[0].description)
                    .addField('Temperature (min/max):',json.main.temp_min + '°C / ' + json.main.temp_max + '°C')
                    .addField('Wind speed:',json.wind.speed + ' m/s')
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