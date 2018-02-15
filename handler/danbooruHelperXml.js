/**
 * This file is handling the danbooru image requests
 * @author emdix
 **/

//Require needed npm modules.
const Discord = require('discord.js');
const request = require('request');
const xml2js = require('xml2js');

//Require needed config or permission files.
const config = require('../configuration/config');

//This segment is executed whenever the bot receives a yandere command
exports.run = (client, message, args, link, siteName, urlPrefix) => {
    /* Tags that cannot be requested:
     * loli -> lolicon
     * shota -> shotacon
     * child -> obvious
     * children -> obvious
     * kid -> obvious
     * furry -> weird
     * monika -> don't look me up you weirdo!
     */
    const bannedTags = ['loli', 'shota', 'child', 'children', 'kid', 'furry', 'monika'];
    //Check if the request comes from a nsfw channel
    if(message.channel.nsfw) {
        //Check if banned tags were requested
        let argContainsBannedTags = bannedTags.some(r=> args.indexOf(r) >= 0);
        if(!argContainsBannedTags) {
            //Making a request
            request.get(link + 'index.php', {
                qs: {
                    page : 'dapi',
                    s : 'post',
                    q : 'index',
                    tags : args.join(' '),
                    pid : 0,
                    limit : config.danbooruImageLimit,
                }
            },function (error, response, body) {
                //If there are no errors proceed with this segment.
                if(!error && response.statusCode === 200) {
                    xml2js.parseString(body, function (err, result) {
                        if(result.posts.post !== undefined) {
                            let index = Math.floor(Math.random()*result.posts.post.length);
                            let timestamp = result.posts.post[index].$.created_at;
                            timestamp = new Date(timestamp*1000);
                            let embed = new Discord.MessageEmbed()
                                .setTitle(siteName + ' random image')
                                .addField('ID:',result.posts.post[index].$.id)
                                .addField('Tags:',result.posts.post[index].$.tags)
                                .addField('Link:', urlPrefix + result.posts.post[index].$.file_url)
                                .setTimestamp(timestamp)
                                .setImage(urlPrefix + result.posts.post[index].$.file_url)
                                .setFooter("Upload by: " + result.posts.post[index].$.creator_id)
                            ;
                            message.channel.send({embed}).catch(console.error);
                        } else {
                            //Building and sending an embedded message.
                            let embed = new Discord.MessageEmbed()
                                .setTitle(siteName + ' command:')
                                .setColor('DARK_RED')
                                .addField('Error:','Could\'t find any pictures with the tags you have given me!')
                                .setFooter('By ' + config.botName)
                                .setTimestamp()
                            ;
                            message.channel.send({embed});
                        }
                    });
                } else {
                    //Building and sending an embedded message.
                    let embed = new Discord.MessageEmbed()
                        .setTitle(siteName + ' command:')
                        .setColor('DARK_RED')
                        .addField('Error:','Could\'t connect to ' + siteName + '!')
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
                .setTitle(siteName + ' command:')
                .setColor('DARK_RED')
                .addField('Error:','This request to ' + siteName + ' contains banned tags!')
                .addField('Banned tags:', bannedTags.join(', '))
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            message.channel.send({embed}).catch(console.error);
        }
    } else {
        //Building and sending an embedded message.
        let embed = new Discord.MessageEmbed()
            .setTitle(siteName + ' command:')
            .setColor('DARK_RED')
            .addField('Error:','This is a SFW channel. ' +
                'Explicit content that comes with the ' + siteName + ' command needs to be posted into NSFW channels')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({embed}).catch(console.error);
    }
};