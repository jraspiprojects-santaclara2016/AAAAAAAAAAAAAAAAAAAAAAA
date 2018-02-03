const Discord = require('discord.js');
const request = require('request');

const config = require('../configuration/config.json');

exports.run = (client, message, args) => {
    if(args.length === 1) {
        request.get('https://api.openweathermap.org/data/2.5/weather', {
            qs: {
                q :args[0],
                appid : process.env.openWeatherMapToken,
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
                let embed = new Discord.RichEmbed()
                    .setTitle('Weather command:')
                    .setColor('DARK_RED')
                    .addField('Error','I haven\'t found any city that matches your input.')
                    .setFooter('By ' + config.botName)
                    .setTimestamp()
                ;
                message.channel.send({embed});
            }
        });
    } else {
        let embed = new Discord.RichEmbed()
            .setTitle('Weather command:')
            .setColor('DARK_RED')
            .addField('Error','The structure of the command was wrong!')
            .addField('Structure',config.commandPrefix + 'weather')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({embed});
    }
};