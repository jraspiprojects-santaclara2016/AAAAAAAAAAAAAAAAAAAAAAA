/**
 * This file is handling the {commandPrefix}whoami command.
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');

//Requiring the needed config/permissions json files.
const config = require('../configuration/config');
const permission = require('../configuration/permissions');

//This segment gets emitted after {commandPrefix}whoami is incoming via the message event.
exports.run = (client, message, args, logger) => {
    let user;
    //Check if there is a @mention in the request.
    if(args.length === 1 && message.mentions.users.first() !== undefined) {
        user = message.mentions.users.first()
    } else {
        user = message.author
    }
    //Translate permission level to actual Ranks.
    let perm = permission[user.id];
    switch(perm) {
        case '0':
            perm = 'Owner-Senpai';
            break;
        case '1':
            perm = 'Moderator';
            break;
        default:
            perm = 'User';
    }
    //Building and sending an embedded message.
    let embed = new Discord.MessageEmbed()
        .setTitle('Whoami command:')
        .setThumbnail(user.avatarURL)
        .setColor('DARK_GREEN')
        .addField('Name:', user.tag)
        .addField('UserID:', user.id)
        .addField('BotPermissions',perm)
        .addField('Created at:', user.createdAt)
        .setFooter('By ' + config.botName)
        .setTimestamp()
    ;
    message.channel.send({embed}).catch(console.error);
};