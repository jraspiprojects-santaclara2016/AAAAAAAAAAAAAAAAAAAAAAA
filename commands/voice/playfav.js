const Discord = require('discord.js');
const play = require('./play');
const dbHandler = require('../../handler/util/mariadbHandler');
const logHandler = require('../../handler/util/winstonLogHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const logger = logHandler.getLogger();

module.exports = {
    name: 'playfav',
    description: 'Play your favorite playlist.',
    disabled: false,
    requireDB: true,
    async execute(client, message, args) {
        if (args.length === 0) return await playFavorite(client, message, message.author.id);
        if(message.mentions.users.first() === undefined) return await sendWrongFormatEmbed(message);
        if(message.mentions.everyone) return await sendIllegalMentionEmbed(message);
        return await playFavorite(client, message, message.mentions.users.first().id);
    },
};

async function playFavorite(client, message, userId) {
    dbHandler.functions.getFavPlaylist(userId).then(data => {
        if(data[0].favPlaylist) {
            play.execute(client, message, [data[0].favPlaylist]);
        }
    }).catch(error => {
        logger.error(`Error: ${error}`);
    });
}

async function sendWrongFormatEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⭐ Favorite:')
        .setColor('DARK_RED')
        .addField('Error', 'Wrong format. Either use 0 Arguments or mention somebody!')
    ;
    messageHandler.sendEmbed('playfav', embed, message.channel);
}

async function sendIllegalMentionEmbed(message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⭐ Favorite:')
        .setColor('DARK_RED')
        .addField('Error', 'Do not mention everyone ot here!')
    ;
    messageHandler.sendEmbed('playfav', embed, message.channel);
}