const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const dispatcherHandler = require('../../handler/voice/dispatcherHandler');
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'stop',
    description: 'Stop the current queue and leave the voice channel.',
    disabled: false,
    async execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if (!serverQueue) return await sendNothingPlayingEmbed();
        await clearQueueAndStopPlayback(message.guild.id);
        await sendStopEmbed(serverQueue, message);
    },
};

async function clearQueueAndStopPlayback(guildId) {
    await dispatcherHandler.stop(guildId);
}

async function sendNothingPlayingEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⏹ Stop:')
        .setColor('DARK_RED')
        .addField('Error', 'There is nothing playing. Therefore I cannot switch the loop state of the music queue!')
    ;
    messageHandler.sendEmbed('stop', embed, message.channel);
}

async function sendStopEmbed(serverQueue, message) {
    const embed = new Discord.MessageEmbed(serverQueue)
        .setTitle('⏹ Stop:')
        .setColor('DARK_GREEN')
        .addField('Success:', 'I have stopped the music!')
    ;
    messageHandler.sendEmbed('stop', embed, message.channel);
}