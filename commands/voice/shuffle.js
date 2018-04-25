const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'shuffle',
    description: 'shuffle.',
    disabled : false,
    async execute(client, message) {
        console.log(message.guild.id);
        const musicQueue = musicCache.get(message.guild.id);
        if(musicQueue.voiceChannel !== message.member.voiceChannel) return await sendNotInChannelEmbed(message.channel);
        await flipShuffleState(message);
    },
};

async function sendNotInChannelEmbed(channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('🔀 Shuffle:')
        .setColor('DARK_RED')
        .addField('❯Shuffle not available', 'You are not in the channel where the music is playing...')
        .setTimestamp()
    ;
    messageHandler.sendEmbed('volume', embed, channel);
}

async function flipShuffleState(message) {
    const musicQueue = musicCache.get(message.guild.id);
    musicQueue.shuffle = !musicQueue.shuffle;
    await sendShuffleEmbed(message);
}

async function sendShuffleEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('🔀 Shuffle:')
        .setColor('DARK_GREEN')
        .addField('❯Shuffle', 'Shuffle will be applied after the current song is over!')
        .setTimestamp()
    ;
    messageHandler.sendEmbed('volume', embed, message.channel);
}