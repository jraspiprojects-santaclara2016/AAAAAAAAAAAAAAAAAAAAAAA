const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'resume',
    description: 'Resume the music.',
    disabled: false,
    requireDB: false,
    async execute(client, message) {
        const musicQueue = musicCache.get(message.guild.id);
        if (!(musicQueue && !musicQueue.playing)) return await sendNothingPlayingEmbed(message);
        await resume(musicQueue, message);
    },
};

async function resume(musicQueue, message) {
    musicQueue.playing = true;
    musicQueue.connection.dispatcher.resume();
    logger.debug('resume: Music resumed.');
    await sendResumeEmbed(musicQueue, message);
}

async function sendResumeEmbed(musicQueue, message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⏯ Resume')
        .setColor('DARK_GREEN')
        .addField('Success', 'Resuming the music playback.')
    ;
    messageHandler.sendEmbed('resume', embed, message.channel);
}

async function sendNothingPlayingEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⏯ Resume')
        .setColor('DARK_RED')
        .addField('Error', 'I could not resume playback, nothing is in the queue!')
    ;
    messageHandler.sendEmbed('resume', embed, message.channel);
}