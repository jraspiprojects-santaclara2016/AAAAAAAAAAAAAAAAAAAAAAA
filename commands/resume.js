const Discord = require('discord.js');

const voiceHandler = require('../handler/voiceHandler');
const queue = voiceHandler.getQueue();

exports.run = async (client, message, args, logger) => {
    const serverQueue = queue.get(message.guild.id);
    if(serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        message.channel.send('Resumed the music.')
    } else {
        message.channel.send('Currently playing. Cannot resume.');
    }
};