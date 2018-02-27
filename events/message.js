const config = require('../configuration/config.json');
const errorEmbedHandler = require('../handler/command/discordErrorEmbedHandler');
const winstonLogHandler = require('../handler/util/winstonLogHandler');
const mariadbHandler = require('../handler/util/mariadbHandler');
const cacheHandler = require('../handler/util/cacheHandler');

const logger = winstonLogHandler.getLogger();


exports.run = async (client, message) => {
    if (message.author.bot) return;
    let prefix;
    if (message.mentions.has(client.user.id)) {
        await handleMentionMessage(message, client);
    } else if (message.guild) {
        prefix = await checkCacheAndGetPrefix(message);
    } else {
        prefix = config.commandPrefix;
    }
    await handlePrefixMessage(message, prefix, client);
};

async function checkCacheAndGetPrefix(message) {
    const guildId = message.guild.id;
    let prefix;
    if (!cacheHandler.getPrefixCache().has(guildId)) {
        try {
            const result = await mariadbHandler.functions.getGuildPrefix(guildId);
            if (result.length === 1) {
                prefix = result[0].prefix;
                cacheHandler.createPrefixCache(guildId, prefix);
            }
        } catch (error) {
            logger.warn('Message: Warning DB error: ' + error);
            prefix = config.commandPrefix;
        }
    } else {
        prefix = cacheHandler.getPrefixCache().get(guildId).prefix;
    }
    return prefix;
}

async function handlePrefixMessage(message, prefix, client) {
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    await executeCommand(args, client, message);
}

async function handleMentionMessage(message, client) {
    const mention = `<@${client.user.id}>`;
    const indexOfMention = message.content.indexOf(mention);
    const args = message.content.substring(indexOfMention).slice(mention.length).trim().split(/ +/g);
    await executeCommand(args, client, message);
}

async function executeCommand(args, client, message) {
    const command = args.shift().toLowerCase();
    logger.info('Command received: ' + command);
    if (!client.commands.has(command)) return errorEmbedHandler.run(client, message, `${command} doesn't exist.`);
    try {
        await client.commands.get(command).execute(client, message, args);
        logger.info(`${command} executed successfully.`);
    } catch (error) {
        errorEmbedHandler.run(client, message, `I could not run the ${command} command. Please contact the bot Owner.`);
        console.log(error);
    }
}