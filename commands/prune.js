const Discord = require('discord.js');

//Require needed config or permission files.
const config = require('../configuration/config');

//This segment is executed whenever the bot receives a clear command.
exports.run = (client, message, args) => {
    if (message.member.hasPermission('MANAGE_MESSAGES')) {
        message.channel.messages.fetch({limit: args}).then(data => {
            data.deleteAll();
            message.channel.send(`deleted ${data.size} messages.`);
        }).catch(error => {
            console.log(error);
        });
    }
};