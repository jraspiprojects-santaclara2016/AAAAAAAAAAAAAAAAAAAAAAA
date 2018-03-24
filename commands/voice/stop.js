const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'stop',
    description: 'Stop the current queue and leave the voice channel.',
    disabled: false,
    async execute(client, message) {
        const serverQueue = musicCache.get(message.guild.id);
        if (!serverQueue) return await sendNothingPlayingEmbed();
        await clearQueueAndStopPlayback(serverQueue);
        await sendStopEmbed(serverQueue, message);
    },
};

async function clearQueueAndStopPlayback(serverQueue) {
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    logger.debug('stop: dispatcher end event called.');
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