const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'commandName',
    description: 'Description of the command.',
    disabled : true,
    async execute(client, message) {
        const musicQueue = musicCache.get(message.member.guild.id);
        if(musicQueue.voiceChannel !== message.member.voiceChannel) return await sendNotInChannelEmbed(message.channel);
        await flipShuffleState();
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
    const musicQueue = musicCache.get(message.member.guild.id);
    musicQueue.shuffle = !musicQueue.shuffle;

}