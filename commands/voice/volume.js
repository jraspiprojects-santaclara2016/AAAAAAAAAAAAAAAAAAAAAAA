const voiceHandler = require('../../handler/voiceHandler');
const queue = voiceHandler.getQueue();

module.exports = {
    name: 'volume',
    description: 'Either display the volume ot set it to the specified value.',
    execute(client, message, args, logger) {
        const serverQueue = queue.get(message.guild.id);
        if(!serverQueue) return message.channel.send('There is nothing playing.');
        if(!(serverQueue.voiceChannel === message.member.voiceChannel)) return message.channel.send('You are not in the channel where the music is playing...');
        if(!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume * 100}%**`);
        serverQueue.volume = parseFloat(args[0]);
        serverQueue.connection.dispatcher.setVolume(serverQueue.volume / 100);
        logger.debug(`Volume set to: ${serverQueue.volume}%`);
    },
};