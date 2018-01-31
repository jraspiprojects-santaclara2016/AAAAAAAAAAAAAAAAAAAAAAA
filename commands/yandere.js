/**
 * This file is handling the {commandPrefix}yandere command.
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');
const request = require('request');

//Require needed config or permission files.
const config = require('../configuration/config');

//This segment is executed whenever the bot receives a yandere command
exports.run = (client, message, args) => {
    //Tags that cannot be requested (for obvious reasons!)
    const bannedTags = ['loli', 'shota', 'child', 'furry', 'monika'];
    //Check if the request comes from a nsfw channel
    if(message.channel.nsfw) {
        //Check if banned tags were requested
        let argContainsBannedTags = bannedTags.some(r=> args.indexOf(r) >= 0);
        if(!argContainsBannedTags) {
            //Making a request to yande.re.
            request.get('https://yande.re/post.json', {
                qs: {
                    limit : config.danbooruImageLimit,
                    tags :'order:score rating:questionableplus' + args.join(' '),
                }
            },function (error, response, body) {
                //If there are no errors proceed with this segment.
                if(!error && response.statusCode == 200) {
                    //Building and sending an embedded message.
                    let index = Math.floor(Math.random()*config.danbooruImageLimit);
                    let json = JSON.parse(body);
                    let timestamp = json[index].created_at;
                    timestamp = new Date(timestamp*1000);
                    let embed = new Discord.RichEmbed()
                        .setTitle('Yande.re random image')
                        .addField('ID:',json[index].id)
                        .addField('Tags:',json[index].tags)
                        .addField('Link:','https://yande.re/post/show/' + json[index].id)
                        .setTimestamp(timestamp)
                        .setImage(json[index].file_url)
                        .setFooter("Upload by: " + json[index].author)
                    ;
                    message.channel.send({embed}).catch(console.error);
                } else {
                    //Building and sending an embedded message.
                    let embed = new Discord.RichEmbed()
                        .setTitle('Yandere command:')
                        .setColor('DARK_RED')
                        .addField('Error:','Could\'t connect to Yande.re!')
                        .addField('HTTP Code:', response.statusCode)
                        .addField('error', error)
                        .setFooter('By ' + config.botName)
                        .setTimestamp()
                    ;
                    message.channel.send({embed});
                    client.fetchUser(config.ownerID).then(user => {user.send({embed})}).catch(console.error);
                }
            })
        } else {
            //Building and sending an embedded message.
            let embed = new Discord.RichEmbed()
                .setTitle('Yandere command:')
                .setColor('DARK_RED')
                .addField('Error:','This request to Yande.re contains banned tags!')
                .addField('Banned tags:', bannedTags.join(', '))
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            message.channel.send({embed}).catch(console.error);
        }
    } else {
        //Building and sending an embedded message.
        let embed = new Discord.RichEmbed()
            .setTitle('Yandere command:')
            .setColor('DARK_RED')
            .addField('Error:','This is a SFW channel. ' +
                'Explicit content that comes with the yandere command needs to be posted into NSFW channels')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({embed}).catch(console.error);
    }
};