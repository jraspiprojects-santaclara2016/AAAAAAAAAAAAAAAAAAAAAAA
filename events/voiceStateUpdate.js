const dispatcherHandler = require('../handler/voice/dispatcherHandler');
const winstonLogHandler = require('../handler/util/winstonLogHandler');
const cacheHandler = require('../handler/util/cacheHandler');
const musicCache = cacheHandler.getMusicCache();
const logger = winstonLogHandler.getLogger();

exports.run = async (client, oldMember, newMember) => {
    if(!oldMember.voiceChannel) return;
    const serverQueue = musicCache.get(oldMember.guild.id);
    if(!serverQueue) return;
    if(serverQueue.voiceChannel === oldMember.voiceChannel) {
        if(oldMember.id === client.user.id) {
            await updateVoiceChannel(serverQueue, oldMember, newMember);
        }
        if (serverQueue.voiceChannel.members.size === 1) {
            await leaveVoiceChannel(oldMember.guild.id);
        }
    }
};

async function updateVoiceChannel(serverQueue, oldMember, newMember) {
    if(newMember.voiceChannel !== oldMember.voiceChannel) {
        logger.debug('voiceStateUpdate: I was moved. Updating voice channel information now!');
        serverQueue.voiceChannel = newMember.voiceChannel;
    }
}

async function leaveVoiceChannel(guildId) {
    logger.debug('voiceStateUpdate: Voice channel empty now... I\'m leaving.');
    await dispatcherHandler.stop(guildId);
}