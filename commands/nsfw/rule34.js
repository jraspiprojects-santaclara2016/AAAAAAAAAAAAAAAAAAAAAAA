const Discord = require('discord.js');
const messageHandler = require('../../handler/command/discordMessageHandler');
const configHandler = require('../../handler/util/configHandler');
const Kaori = require('kaori');
const kaori = new Kaori();


module.exports = {
    name: 'rule34',
    description: 'You know what Rule34 is :^)',
    disabled: false,
    requireDB: false,
    async execute(client, message, args) {
        console.log(message.channel.nsfw);
        if(!message.channel.nsfw) return await sendNsfwOnlyEmbed(message.channel);
        const argContainsBannedTags = configHandler.getDanbooruConfig().bannedTags.some(r => args.indexOf(r) >= 0);
        if (argContainsBannedTags) return await sendIllegalTagsEmbed(message.channel);
        try {
            const image = await kaori.search('rule34', { tags: args, limit: 1, random: true });
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
        .setTitle('Rule34 random image')
        .addField('ID:', image[0].id)
        .addField('Tags:', image[0].tags)
        .addField('Link:', 'https://rule34.xxx/post/show/' + image[0].id)
        .setTimestamp(timestamp)
        .setImage(image[0].file_url)
        .setFooter('Upload by: ' + image[0].author)
    ;
    messageHandler.sendEmbed('rule34', embed, channel);
}

async function sendErrorEmbed(channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Rule34 random image')
        .addField('ERROR:', 'I could not get a random image from yande.re')
        .setTimestamp()
    ;
    messageHandler.sendEmbed('rule34', embed, channel);
}

async function sendIllegalTagsEmbed(channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Rule34 random image')
        .addField('ERROR:', 'You searched for tags that are banned. They are banned either by Discord or by us in order to prevent users from seeing disturbing images.')
        .setTimestamp()
    ;
    messageHandler.sendEmbed('rule34', embed, channel);
}

async function sendNsfwOnlyEmbed(channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Rule34 random image')
        .addField('ERROR:', 'This command is only available in NSFW channels due to the ToS of Discord!')
        .setTimestamp()
    ;
    messageHandler.sendEmbed('rule34', embed, channel);
}