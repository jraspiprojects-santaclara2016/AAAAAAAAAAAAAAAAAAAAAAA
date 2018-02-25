const voiceHandler = require('../handler/command/voiceHandler');
const winstonLogHandler = require('../handler/util/winstonLogHandler');
const logger = winstonLogHandler.getLogger();
const queue = voiceHandler.getQueue();

exports.run = async (client, oldMember, newMember) => {
    if(!oldMember.voiceChannel) return;
    const serverQueue = queue.get(oldMember.guild.id);
    if(!serverQueue) return;
    if(serverQueue.voiceChannel === oldMember.voiceChannel) {
        if(oldMember.id === client.user.id) {
            await updateVoiceChannel(serverQueue, oldMember, newMember);
        }
        if (serverQueue.voiceChannel.members.size === 1) {
            await leaveVoiceChannel(serverQueue);
        }
    }
};

async function updateVoiceChannel(serverQueue, oldMember, newMember) {
    if(newMember.voiceChannel !== oldMember.voiceChannel) {
        logger.debug('I was moved. Updating voice channel information now!');
        serverQueue.voiceChannel = newMember.voiceChannel;
    }
}

async function leaveVoiceChannel(serverQueue) {
    logger.debug('voiceStateUpdate: Voicechannel now empty... I\'m leaving now.');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}