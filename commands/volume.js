const Discord = require('discord.js');

const voiceHandler = require('../handler/voiceHandler');
const queue = voiceHandler.getQueue();

exports.run = (client, message, args, logger) => {
    const serverQueue = queue.get(message.guild.id);
    if(!serverQueue) return message.channel.send('There is nothing playing.');
    if(!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume*100}%**`);
    serverQueue.volume = args[0]/100;
    serverQueue.connection.dispatcher.setVolume(args[0]/100);
};