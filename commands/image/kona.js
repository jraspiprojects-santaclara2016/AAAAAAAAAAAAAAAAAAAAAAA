const Discord = require('discord.js');
const messageHandler = require('../../handler/command/discordMessageHandler');
const config = require('../../configuration/config');
const Kaori = require('kaori');
const kaori = new Kaori();


module.exports = {
    name: 'kona',
    description: 'Get a random image from konachan.com',
    disabled: false,
    requireDB: false,
    async execute(client, message, args) {
        const argContainsBannedTags = config.danbooru.bannedTags.some(r => args.indexOf(r) >= 0);
        if (argContainsBannedTags) return await sendIllegalTagsEmbed(message.channel);
        try {
            message.channel.nsfw ? args.push('rating:questionableplus') : args.push('rating:safe');
            const image = await kaori.search('konachan', { tags: args, limit: 1, random: true });
            await sendImageEmbed(image, message.channel);
        } catch (error) {
            await sendErrorEmbed(message.channel);
        }
    },
};

async function sendImageEmbed(image, channel) {
    let timestamp = image[0].created_at;
    timestamp = new Date(timestamp * 1000);
    const embed = new Discord.MessageEmbed()
        .setTitle('Kona random image')
        .addField('ID:', image[0].id)
        .addField('Tags:', image[0].tags)
        .addField('Link:', 'https://konachan.com/post/show/' + image[0].id)
        .setTimestamp(timestamp)
        .setImage(image[0].file_url)
        .setFooter('Upload by: ' + image[0].author)
    ;
    messageHandler.sendEmbed('kona', embed, channel);
}

async function sendErrorEmbed(channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Kona random image')
        .addField('ERROR:', 'I could not get a random image from konachan.com')
        .setTimestamp()
    ;
    messageHandler.sendEmbed('kona', embed, channel);
}

async function sendIllegalTagsEmbed(channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Yandere random image')
        .addField('ERROR:', 'You searched for tags that are banned. They are banned either by Discord or by us in order to prevent users from seeing disturbing images.')
        .setTimestamp()
    ;
    messageHandler.sendEmbed('yandere', embed, channel);
}