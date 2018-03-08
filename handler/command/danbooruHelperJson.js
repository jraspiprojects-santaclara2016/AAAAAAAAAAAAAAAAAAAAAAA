const Discord = require('discord.js');
const request = require('request');
const winstonLogHandler = require('../util/winstonLogHandler');
const config = require('../../configuration/config');

const logger = winstonLogHandler.getLogger();

exports.run = (client, message, args, link, sitename) => {
    /* Tags that cannot be requested:
     * loli -> lolicon
     * shota -> shotacon
     * child -> obvious
     * furry -> weird
     * monika -> don't look me up you weirdo!
     */
    const bannedTags = ['loli', 'shota', 'child', 'furry', 'monika'];
    if (message.channel.nsfw) {
        // Check if banned tags were requested
        const argContainsBannedTags = bannedTags.some(r => args.indexOf(r) >= 0);
        if (!argContainsBannedTags) {
            // Making a request to konachan.com.
            request.get(link + 'post.json/', {
                qs: {
                    limit: config.danbooruImageLimit,
                    tags: 'order:score rating:questionableplus ' + args.join(' '),
                },
            }, function(error, response, body) {
                // If there are no errors proceed with this segment.
                if (!error && response.statusCode === 200) {
                    // Building and sending an embedded message.
                    const index = Math.floor(Math.random() * config.danbooruImageLimit);
                    const json = JSON.parse(body);
                    if(json[index] !== undefined) {
                        let timestamp = json[index].created_at;
                        timestamp = new Date(timestamp * 1000);
                        const embed = new Discord.MessageEmbed()
                            .setTitle(sitename + ' random image')
                            .addField('ID:', json[index].id)
                            .addField('Tags:', json[index].tags)
                            .addField('Link:', link + 'post/show/' + json[index].id)
                            .setTimestamp(timestamp)
                            .setImage(json[index].file_url)
                            .setFooter('Upload by: ' + json[index].author)
                        ;
                        message.channel.send({ embed }).catch(messageError => logger.error(`danboruHelperJson: Error sending message: ${messageError}`));
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setTitle(sitename + ' command:')
                            .setColor('DARK_RED')
                            .addField('Error:', 'Tag does not exist!')
                            .addField('HTTP Code:', response.statusCode)
                            .addField('error', error)
                            .setFooter('By ' + config.botName)
                            .setTimestamp()
                        ;
                        message.channel.send({ embed }).catch(messageError => logger.error(`danboruHelperJson: Error sending message: ${messageError}`));
                    }
                } else {
                    // Building and sending an embedded message.
                    const embed = new Discord.MessageEmbed()
                        .setTitle(sitename + ' command:')
                        .setColor('DARK_RED')
                        .addField('Error:', 'Could\'t connect to ' + sitename + '!')
                        .addField('HTTP Code:', response.statusCode)
                        .addField('error', error)
                        .setFooter('By ' + config.botName)
                        .setTimestamp()
                    ;
                    message.channel.send({ embed }).catch(messageError => logger.error(`danboruHelperJson: Error sending message: ${messageError}`));
                    client.fetchUser(config.ownerID).then(user => {
                        user.send({ embed });
                    }).catch(messageError => logger.error(`danboruHelperJson: Error: ${messageError}`));
                }
            });
        } else {
            // Building and sending an embedded message.
            const embed = new Discord.MessageEmbed()
                .setTitle(sitename + ' command:')
                .setColor('DARK_RED')
                .addField('Error:', 'This request to ' + sitename + ' contains banned tags!')
                .addField('Banned tags:', bannedTags.join(', '))
                .setFooter('By ' + config.botName)
                .setTimestamp()
            ;
            message.channel.send({ embed }).catch(messageError => logger.error(`danboruHelperJson: Error sending message: ${messageError}`));
        }
    } else {
        // Building and sending an embedded message.
        const embed = new Discord.MessageEmbed()
            .setTitle(sitename + ' command:')
            .setColor('DARK_RED')
            .addField('Error:', 'This is a SFW channel. ' +
                'Explicit content that comes with the ' + sitename + ' command needs to be posted into NSFW channels')
            .setFooter('By ' + config.botName)
            .setTimestamp()
        ;
        message.channel.send({ embed }).catch(error => logger.error(`danboruHelperJson: Error sending message: ${error}`));
    }
};