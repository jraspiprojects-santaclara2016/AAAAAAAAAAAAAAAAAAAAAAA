const youtubeSongHandler = require('../../handler/voice/youtubeSongHandler');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const streamHandler = require('../../handler/voice/streamHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'play',
    description: 'Play music.',
    disabled: false,
    requireDB: false,
    async execute(client, message, args) {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel!');
        if (!checkPermissions(client, message, voiceChannel)) return;
        if (isYoutubeLink(args[0])) return await youtubeSongHandler.handleYoutubeLink(args[0], message, voiceChannel);
        if (isStreamLink(args[0])) return streamHandler.handleStreamLink(args[0], message, voiceChannel);
        return await youtubeSongHandler.youtubeSearch(args.join(' '), message, voiceChannel);
    },
};

function checkPermissions(client, message, voiceChannel) {
    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has('CONNECT')) {
        logger.debug('play: Bot can not join Channel (MISSING_CONNECT_PERMISSION).');
        message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        return false;
    }
    if (!permissions.has('SPEAK')) {
        logger.debug('play: Bot can not join Channel (MISSING_SPEAK_PERMISSION).');
        message.channel.send('I cannot speak in your voice channel, make sure I have the proper permissions!');
        return false;
    }
    logger.debug('Bot can join Channel.');
    return true;
}

function isYoutubeLink(link) {
    return link.match(/^https?:\/\/(www.youtube.com|youtube.com)\/(.*)$/);
}

function isStreamLink(link) {
    return link.match(/(^http:\/\/|https:\/\/)(.*)(.mp3)/);
}
