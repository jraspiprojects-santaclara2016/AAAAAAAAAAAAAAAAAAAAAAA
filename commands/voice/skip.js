const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'skip',
    description: 'Skip to the next song.',
    disabled: false,
    async execute(client, message) {
        const musicQueue = musicCache.get(message.guild.id);
        if (!musicQueue) return await sendNothingPlayingEmbed(message);
        await skipTrack(musicQueue, message);
    },
};

async function skipTrack(musicQueue, message) {
    if (musicQueue.loop) musicQueue.loop = !musicQueue.loop;
    musicQueue.connection.dispatcher.end();
    logger.debug('skip: dispatcher end executed.');
    await sendSkipEmbed(musicQueue, message);
}

async function sendNothingPlayingEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⏭ Skip:')
        .setColor('DARK_RED')
        .addField('Error', 'There is nothing playing. Therefore I cannot skip to the next track!')
    ;
    messageHandler.sendEmbed('skip', embed, message.channel);
}

async function sendSkipEmbed(musicQueue, message) {
    const embed = new Discord.MessageEmbed(musicQueue)
        .setTitle('⏭ skip:')
        .setColor('DARK_GREEN')
        .addField('Success:', 'Skipping song!')
    ;
    messageHandler.sendEmbed('skip', embed, message.channel);
}