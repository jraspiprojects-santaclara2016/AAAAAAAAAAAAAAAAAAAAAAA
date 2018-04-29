const errorEmbedHandler = require('../handler/command/discordErrorEmbedHandler');
const winstonLogHandler = require('../handler/util/winstonLogHandler');
const mariadbHandler = require('../handler/util/mariadbHandler');
const cacheHandler = require('../handler/util/cacheHandler');
const configHandler = require('../handler/util/configHandler');

const logger = winstonLogHandler.getLogger();
let generalConfig;

exports.run = async (client, message) => {
    generalConfig = configHandler.getGeneralConfig();
    if (message.author.bot) return;
    let prefix;
    if (message.mentions.everyone) return;
    if (message.mentions.has(client.user.id)) {
        await handleMentionMessage(message, client);
    } else if (message.guild) {
        prefix = await checkCacheAndGetPrefix(message.guild.id);
    } else {
        prefix = generalConfig.commandPrefix;
    }
    await handlePrefixMessage(message, prefix, client);
};

async function checkCacheAndGetPrefix(guildId) {
    let prefix;
    if (!cacheHandler.getPrefixCache().has(guildId)) {
        if (await !mariadbHandler.functions.checkDatabase()) {
            prefix = await mariadbHandler.functions.getGuildPrefix(guildId);
            if (!prefix) {
                prefix = generalConfig.commandPrefix;
            }
            cacheHandler.createPrefixCache(guildId, prefix);
        } else {
            prefix = generalConfig.commandPrefix;
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
    logger.info('Message: Command received: ' + command);
    if (!client.commands.has(command)) return errorEmbedHandler.run(client, message, `${command} doesn't exist.`);
    if (client.commands.get(command).disabled) return errorEmbedHandler.run(client, message, `The command ${command} has been DISABLED temporarily!`);
    try {
        await client.commands.get(command).execute(client, message, args);
        logger.info(`Message: ${command} executed successfully.`);
    } catch (error) {
        errorEmbedHandler.run(client, message, `I could not run the ${command} command. Please contact the bot Owner.`);
        logger.error(`Message: Error executing ${command}: ${error}`);
    }
}