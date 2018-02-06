const Discord = require('discord.js');
const config = require('../configuration/config');
var lolapi = require('league-api-2.0');

exports.run = (client, message, args) => {
    lolapi.base.setKey(process.env.lolToken);
    lolapi.base.setBaseURL(".api.riotgames.com");
    lolapi.base.setRegion("euw1");
    lolapi.base.setRateLimit(20);

    lolapi.executeCall("Summoner","getSummonerBySummonerName",args.join(' '))
        .then((success) => {
            console.log(success);
            let embed = new Discord.RichEmbed()
                .setTitle('Lolrank command:')
                .setColor('DARK_GREEN')
                .setThumbnail('http://avatar.leagueoflegends.com/euw/'+ args.join('%20') +'.png')
                .addField('SummonerName',success.name)
                .addField('Summonerlevel',success.summonerLevel)
                .addField('AccountID', success.accountId)
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            message.channel.send({embed});
        })
        .catch((error) => {
            console.log(error);
        })
};