const Discord = require('discord.js');
const dbHandler = require('../../handler/util/mariadbHandler');
const logHandler = require('../../handler/util/winstonLogHandler');
const logger = logHandler.getLogger();
const messageHandler = require('../../handler/command/discordMessageHandler');

module.exports = {
    name: 'setfav',
    description: 'List or set your favorite playlist/song.',
    disabled: false,
    requireDB: true,
    async execute(client, message, args) {
        if (args.length === 0) return await sendListFavEmbed(message);
        if (args.length === 1) return await insertFavIntoDatabase(args[0], message);
    },
};

async function insertFavIntoDatabase(fav, message) {
    dbHandler.functions.setFavPlaylist(fav, message.author.id);
    await sendSetFavEmbed(fav, message);
}

async function sendListFavEmbed(message) {
    dbHandler.functions.getFavPlaylist(message.author.id).then(data => {
        const embed = new Discord.MessageEmbed()
            .setTitle('⭐ Favorite:')
            .setColor('DARK_GREEN')
            .addField('Current fav', data[0].favPlaylist)
        ;
        messageHandler.sendEmbed('setFav', embed, message.channel);
    }).catch(error => {
        logger.error(`setFav: error in database query getFavPlaylist: ${error}`);
    });
}

async function sendSetFavEmbed(fav, message) {
    const embed = new Discord.MessageEmbed()
        .setTitle('⭐ Favorite:')
        .setColor('DARK_GREEN')
        .addField('Current fav', fav)
    ;
    messageHandler.sendEmbed('setFav', embed, message.channel);
}