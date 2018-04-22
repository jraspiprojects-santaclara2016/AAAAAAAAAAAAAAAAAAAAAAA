const Discord = require('discord.js');
const malApi = require('mal-api');
const logHandler = require('../../handler/util/winstonLogHandler');
const secretHandler = require('../../handler/util/secretHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const mal = new malApi(secretHandler.getMyAnimeListSecrets());
const logger = logHandler.getLogger();

module.exports = {
    name: 'manga',
    description: 'Search for information about an manga.',
    disabled: false,
    async execute(client, message, args) {
        if(!args.length > 0) return;
        await lookupManga(args.join(' '), message.channel);
    },
};

async function lookupManga(searchString, textChannel) {
    try {
        const manga = await mal.manga.searchManga(searchString);
        console.log(manga);
        if(manga.length > 1) return await awaitMessageSearch(manga, textChannel);
        await sendMangaEmbed(manga[0], textChannel);
    } catch(error) {
        logger.error(`manga:  Could not look up manga! Error message: ${error}`);
    }
}

async function awaitMessageSearch(mangalist, textChannel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Manga search:')
        .setColor('DARK_GREEN')
        .addField('Multiple entries found:', 'Please respond with a number to select a specific entry. (After 20 seconds the selection will be canceled!)');
    const maxentries = mangalist.length > 10 ? 10 : mangalist.length;
    for(let i = 0; i < maxentries; i++) {
        embed.addField(`${i + 1}: ` + mangalist[i].title, `${mangalist[i].synopsis.substr(0, 50)}...`);
    }
    messageHandler.sendEmbed('manga', embed, textChannel);
    let response;
    try {
        response = await textChannel.awaitMessages(m => m.content > 0 && m.content < maxentries + 1, {
            max: 1,
            time: 20000,
            errors: ['time'],
        });
    } catch (err) {
        logger.error(`manga: Error: ${err}`);
        return messageHandler.sendMessage('manga', 'No or invalid value entered, cancelling video selection.', textChannel);
    }
    const mangaIndex = parseInt(response.first().content);
    await sendMangaEmbed(mangalist[mangaIndex - 1], textChannel);
}

async function sendMangaEmbed(manga, textChannel) {
    if(manga.synopsis.length > 1024) manga.synopsis = manga.synopsis.substr(0, 1020) + '...';
    const embed = new Discord.MessageEmbed()
        .setTitle('Manga search:')
        .setColor('DARK_GREEN')
        .addField('Title:', manga.title, true)
        .addField('Title (en):', manga.english, true)
        .addField('Chapters:', manga.chapters, true)
        .addField('Volumes:', manga.volumes, true)
        .addField('Score:', manga.score, true)
        .addField('Type:', manga.type, true)
        .addField('Started:', manga.start_date, true)
        .addField('Ended:', manga.end_date, true)
        .addField('Status:', manga.status, true)
        .addField('Synopsis:', manga.synopsis)

        .setImage(manga.image)
    ;
    messageHandler.sendEmbed('manga', embed, textChannel);
}