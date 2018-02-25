const Discord = require('discord.js');
const voiceHandler = require('../../handler/command/voiceHandler');
const logHandler = require('../../handler/util/winstonLogHandler');
const queue = voiceHandler.getQueue();
const logger = logHandler.getLogger();


module.exports = {
    name: 'volume',
    description: 'Either display the volume ot set it to the specified value.',
    async execute(client, message, args) {
        let embed;
        const serverQueue = queue.get(message.guild.id);
        if(!serverQueue) return message.channel.send('There is nothing playing.');
        if(!(serverQueue.voiceChannel === message.member.voiceChannel)) return message.channel.send('You are not in the channel where the music is playing...');
        if(!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume * 100}%**`);
        if(args[0] > 100) {
            embed = new Discord.MessageEmbed()
                .setTitle('Volume selection:')
                .setColor('ORANGE')
                .addField(`Want the Volume on ${args[0]}%?`, '__y__es / __n__o (You have 10 seconds for your response.)')
                .setImage('https://media.giphy.com/media/AaPprMJQPomTC/giphy.gif')
            ;
            message.channel.send({ embed });
            let response;
            try {
                response = await message.channel.awaitMessages(m => m.content === 'y' || m.content === 'n', {
                    max: 1,
                    time: 10000,
                    errors: ['time'],
                });
            } catch (err) {
                console.error(err);
                return message.channel.send('No or invalid value entered, cancelling volume selection.');
            }
            if(response.first().content === 'y') {
                if(args[0] > 9000) {
                    embed = new Discord.MessageEmbed()
                        .setTitle('OVER 9000:')
                        .setColor('DARK_RED')
                        .setImage('https://media1.tenor.com/images/b43b9d424f531fc1d8f2574a8bd348fa/tenor.gif')
                    ;
                    return message.channel.send({ embed });
                }
                setVolume(serverQueue, args[0]);
            } else {
                message.channel.send('Aborted.');
            }
        } else {
            setVolume(serverQueue, args[0]);
        }
    },
};

function setVolume(serverQueue, volume) {
    serverQueue.volume = parseFloat(volume / 100);
    serverQueue.connection.dispatcher.setVolume(serverQueue.volume);
    logger.debug(`Volume set to: ${serverQueue.volume}%`);
}