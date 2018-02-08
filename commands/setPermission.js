/**
 * This file is handling the {commandPrefix}setPermissions command.
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');

//Require needed config or permission files.
const config = require('../configuration/config');
const permissions = require('../configuration/permissions');

//This segment is executed whenever the bot receives a setPermissions command
exports.run = (client, message, args, logger) => {
    //Check if the sender is permission level 0 (Owner).
    if(permissions[message.author.id] === '0') {
        //Check if the command has 2 arguments and if there is a mention.
        if(args.length === 2 && message.mentions.users.first() !== undefined) {
            //Check if the permission level a user is going to request is actually a valid level.
            if(args[1] > config.maxPermission && args[1] <= config.minPermission) {
                //TODO: save the UID and permission level to the permission.json
            } else {
                //Building and sending an embedded message.
                let embed = new Discord.RichEmbed()
                    .setTitle('Set permission Command')
                    .setColor('DARK_RED')
                    .addField('Error:','Permission level not found!')
                    .addField('Structure:', config.commandPrefix +'setPermission @user [' +
                        config.maxPermission + '-' + config.minPermission + ']')
                    .setFooter('By ' + config.botName)
                    .setTimestamp()
                ;
                message.channel.send({embed}).catch(console.error);
            }
        } else {
            //Building and sending an embedded message.
            let embed = new Discord.RichEmbed()
                .setTitle('Set permission Command')
                .setColor('DARK_RED')
                .addField('Error:','The structure of the command was wrong!')
                .addField('Structure:', config.commandPrefix +'setPermission @user [' +
                    config.maxPermission + '-' + config.minPermission + ']')
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            message.channel.send({embed}).catch(console.error);
        }
    } else {
        //Building and sending an embedded message.
        let embed = new Discord.RichEmbed()
            .setTitle('Set permission Command')
            .setColor('DARK_RED')
            .addField('Error:','You currently don\'t have enough permissions to execute this command.')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({embed}).catch(console.error);
    }
};