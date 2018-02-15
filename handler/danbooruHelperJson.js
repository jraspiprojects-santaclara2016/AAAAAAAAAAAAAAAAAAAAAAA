/**
 * This file is handling the danbooru image requests
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');
const request = require('request');

//Require needed config or permission files.
const config = require('../configuration/config');

//This segment is executed whenever the bot receives a yandere command
exports.run = (client, message, args, link, sitename) => {
    /* Tags that cannot be requested:
     * loli -> lolicon
     * shota -> shotacon
     * child -> obvious
     * furry -> weird
     * monika -> don't look me up you weirdo!
     */
    const bannedTags = ['loli', 'shota', 'child', 'furry', 'monika'];
    //Check if the request comes from a nsfw channel
    if(message.channel.nsfw) {
        //Check if banned tags were requested
        let argContainsBannedTags = bannedTags.some(r=> args.indexOf(r) >= 0);
        if(!argContainsBannedTags) {
            //Making a request to konachan.com.
            request.get(link + 'post.json/', {
                qs: {
                    limit : config.danbooruImageLimit,
                    tags :'order:score rating:questionableplus' + args.join(' '),
                }
            },function (error, response, body) {
                //If there are no errors proceed with this segment.
                if(!error && response.statusCode === 200) {
                    //Building and sending an embedded message.
                    let index = Math.floor(Math.random()*config.danbooruImageLimit);
                    let json = JSON.parse(body);
                    let timestamp = json[index].created_at;
                    timestamp = new Date(timestamp*1000);
                    let embed = new Discord.MessageEmbed()
                        .setTitle(sitename + ' random image')
                        .addField('ID:',json[index].id)
                        .addField('Tags:',json[index].tags)
                        .addField('Link:', link +'post/show/' + json[index].id)
                        .setTimestamp(timestamp)
                        .setImage(json[index].file_url)
                        .setFooter("Upload by: " + json[index].author)
                    ;
                    message.channel.send({embed}).catch(console.error);
                } else {
                    //Building and sending an embedded message.
                    let embed = new Discord.MessageEmbed()
                        .setTitle(sitename + ' command:')
                        .setColor('DARK_RED')
                        .addField('Error:','Could\'t connect to ' + sitename + '!')
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
            let embed = new Discord.MessageEmbed()
                .setTitle(sitename + ' command:')
                .setColor('DARK_RED')
                .addField('Error:','This request to ' + sitename + ' contains banned tags!')
                .addField('Banned tags:', bannedTags.join(', '))
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            message.channel.send({embed}).catch(console.error);
        }
    } else {
        //Building and sending an embedded message.
        let embed = new Discord.MessageEmbed()
            .setTitle(sitename + ' command:')
            .setColor('DARK_RED')
            .addField('Error:','This is a SFW channel. ' +
                'Explicit content that comes with the ' + sitename + ' command needs to be posted into NSFW channels')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({embed}).catch(console.error);
    }
};