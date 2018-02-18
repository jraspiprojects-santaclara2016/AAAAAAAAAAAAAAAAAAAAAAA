const Discord = require('discord.js');

const voiceHandler = require('../handler/voiceHandler');
const queue = voiceHandler.getQueue();

exports.run = (client, message, args, logger) => {
    const serverQueue = queue.get(message.guild.id);
    if(!serverQueue) return message.channel.join('There is nothing playing I could skip for you.');
    serverQueue.connection.dispatcher.end();
};