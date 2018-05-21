const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'np',
    description: 'Now playing command for the voice integration.',
    disabled: false,
    requireDB: false,
    async execute(client, message) {
        const musicQueue = musicCache.get(message.guild.id);
        if (!musicQueue) return await sendNothingPlayingEmbed(message);
        await sendCurrentSongEmbed(musicQueue, message);
    },
};

async function sendNothingPlayingEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('🎶 Now playing:')
        .setColor('DARK_RED')
        .addField('Error', 'There is currently nothing playing.')
    ;
    messageHandler.sendEmbed('np', embed, message.channel);
}

async function sendCurrentSongEmbed(musicQueue, message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('🎶 Now playing:')
        .setColor('DARK_GREEN')
        .addField('Currently playing', `**${musicQueue.songs[0].title}**`)
    ;
    messageHandler.sendEmbed('np', embed, message.channel);
}