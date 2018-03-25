const Discord = require('discord.js');
const cacheHandler = require('../../handler/util/cacheHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const logger = winstonLogHandler.getLogger();
const musicCache = cacheHandler.getMusicCache();

module.exports = {
    name: 'loop',
    description: 'loop/unloop the current playing music.',
    disabled: false,
    async execute(client, message) {
        const musicQueue = musicCache.get(message.guild.id);
        if (!musicQueue) return sendNothingPlayingEmbed(message);
        await switchLoopState(musicQueue);
        await sendLoopStateEmbed(musicQueue, message);
    },
};

async function switchLoopState(musicQueue) {
    musicQueue.loop = !musicQueue.loop;
    logger.debug(`loop: loop toggled to: ${musicQueue.loop}`);
}

async function sendNothingPlayingEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('➿ Loop:')
        .setColor('DARK_RED')
        .addField('Currently playing', 'Nothing')
        .addField('Error', 'There is nothing playing. Therefore I cannot switch the loop state of the music queue!')
    ;
    messageHandler.sendEmbed('loop', embed, message.channel);
}

async function sendLoopStateEmbed(musicQueue, message) {
    const embed = new Discord.MessageEmbed(musicQueue)
        .setTitle('➿ Loop:')
        .setColor('DARK_GREEN')
        .addField('Current playing:', musicQueue.songs[0].title)
        .addField('Looped:', (musicQueue.loop === true ? 'Yes' : 'No'))
    ;
    messageHandler.sendEmbed('loop', embed, message.channel);
}