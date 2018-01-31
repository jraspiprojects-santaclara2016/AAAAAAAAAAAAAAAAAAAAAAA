/**
 * This file is handling the {commandPrefix}clear command.
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');

//Require needed config or permission files.
const config = require('../configuration/config');

//This segment is executed whenever the bot receives a clear command.
exports.run = (client, message, args) => {
    if (message.member.hasPermission('MANAGE_MESSAGES')) {
        message.channel.fetchMessages().then((list) => {
            message.channel.bulkDelete(list).then(() => {
                let embed = new Discord.RichEmbed()
                    .setTitle('Clearchat Command:')
                    .addField('Success','Cleared the chat!')
                    .setColor('DARK_GREEN')
                    .setTimestamp()
                    .setFooter('By ' + config.botName)
                ;
                message.channel.send({embed}).catch(console.error);
            }).catch((error) => {
            });
        }).catch((error) => {
            let embed = new Discord.RichEmbed()
                .setTitle('Clearchat Command:')
                .addField('Error','Cannot fetch the messages in the Channel...')
                .addField('ERROR:', error)
                .setColor('DARK_RED')
                .setTimestamp()
                .setFooter('By ' + config.botName)
            ;
            console.log(error);
            message.channel.send({embed}).catch(console.error);
        })
    }
}