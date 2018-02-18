const Discord = require('discord.js');

const voiceHandler = require('../handler/voiceHandler');
const queue = voiceHandler.getQueue();

exports.run = (client, message, args, logger) => {
    const serverQueue = queue.get(message.guild.id);
    if(!serverQueue) return message.channel.join('There is nothing playing.');
    let index = 1;
    message.channel.send(`
    ___**Song queue:**___
${serverQueue.songs.map(song => `**${index++} -** ${song.title}`).join('\n')}
    
***Now playing:*** ${serverQueue.songs[0].title}
    `);
};