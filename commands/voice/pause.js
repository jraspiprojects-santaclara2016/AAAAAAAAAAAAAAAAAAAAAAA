const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const musicCache = cacheHandler.getMusicCache();
const messageHandler = require('../../handler/command/discordMessageHandler');

module.exports = {
    name: 'pause',
    description: 'Pause the music.',
    disabled: false,
    requireDB: false,
    async execute(client, message) {
        const musicQueue = musicCache.get(message.guild.id);
        if(!(musicQueue && musicQueue.playing)) return await sendNothingPlayingEmbed(message);
        await pauseMusic(musicQueue, message);
    },
};

async function pauseMusic(musicQueue, message) {
    musicQueue.playing = false;
    musicQueue.connection.dispatcher.pause();
    await sendPauseEmbed(message);
}

async function sendPauseEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⏸ Pause')
        .setColor('DARK_GREEN')
        .addField('Pause', 'I paused the music playback.')
    ;
    messageHandler.sendEmbed('pause', embed, message.channel);
}

async function sendNothingPlayingEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⏸ Pause')
        .setColor('DARK_RED')
        .addField('Error', 'I could not pause because there is no music playing currently!')
    ;
    messageHandler.sendEmbed('pause', embed, message.channel);
}