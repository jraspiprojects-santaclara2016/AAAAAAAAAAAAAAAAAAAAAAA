const Discord = require('discord.js');

const voiceHandler = require('../../handler/voiceHandler');
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'stop',
    description: 'Stop the current queue and leave the voice channel.',
    execute(client, message, args, logger) {
        const serverQueue = queue.get(message.guild.id);
        if(!serverQueue) return message.channel.join('There is nothing playing I could stop for you.');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
};