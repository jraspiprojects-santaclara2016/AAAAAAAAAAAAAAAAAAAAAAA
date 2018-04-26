const Discord = require('discord.js');
const malApi = require('mal-api');
const logHandler = require('../../handler/util/winstonLogHandler');
const secretHandler = require('../../handler/util/secretHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const mal = new malApi(secretHandler.getMyAnimeListSecrets());
const logger = logHandler.getLogger();

module.exports = {
    name: 'anime',
    description: 'Search for information about an anime.',
    disabled: false,
    async execute(client, message, args) {
        if(!args.length > 0) return;
        await lookupAnime(args.join(' '), message.channel);
    },
};

async function lookupAnime(searchString, textChannel) {
    try {
        const anime = await mal.anime.searchAnime(searchString);
        if(anime.length > 1) return await awaitMessageSearch(anime, textChannel);
        await sendAnimeEmbed(anime[0], textChannel);
    } catch(error) {
        logger.error(`anime:  Could not look up anime! Error message: ${error}`);
    }
}

async function awaitMessageSearch(animelist, textChannel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Anime search:')
        .setColor('DARK_GREEN')
        .addField('Multiple entries found:', 'Please respond with a number to select a specific entry. (After 20 seconds the selection will be canceled!)');
    const maxentries = animelist.length > 10 ? 10 : animelist.length;
    for(let i = 0; i < maxentries; i++) {
        embed.addField(`${i + 1}: ` + animelist[i].title, `${animelist[i].synopsis.substr(0, 50)}...`);
    }
    messageHandler.sendEmbed('anime', embed, textChannel);
    let response;
    try {
        response = await textChannel.awaitMessages(m => m.content > 0 && m.content < maxentries + 1, {
            max: 1,
            time: 20000,
            errors: ['time'],
        });
    } catch (err) {
        logger.error(`manga: Error: ${err}`);
        return messageHandler.sendMessage('anime', 'No or invalid value entered, cancelling video selection.', textChannel);
    }
    const animeIndex = parseInt(response.first().content);
    await sendAnimeEmbed(animelist[animeIndex - 1], textChannel);
}

async function sendAnimeEmbed(anime, textChannel) {
    if(anime.synopsis.length > 1024) anime.synopsis = anime.synopsis.substr(0, 1020) + '...';
    const embed = new Discord.MessageEmbed()
        .setTitle('Anime search:')
        .setColor('DARK_GREEN')
        .addField('Title:', anime.title, true)
        .addField('Title (en):', anime.english, true)
        .addField('Episodes:', anime.episodes, true)
        .addField('score:', anime.score, true)
        .addField('type:', anime.type, true)
        .addField('status:', anime.status, true)
        .addField('Started:', anime.start_date, true)
        .addField('Ended:', anime.end_date, true)
        .addField('Synopsis:', anime.synopsis)
        .setImage(anime.image)
    ;
    messageHandler.sendEmbed('anime', embed, textChannel);
}