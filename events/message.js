const config = require('../configuration/config.json');
const errorEmbedHandler = require('../handler/discordErrorEmbedHandler');
const winstonLogHandler = require('../handler/winstonLogHandler');
const mariadbHandler = require('../handler/mariadbHandler');
const logger = winstonLogHandler.getLogger();


exports.run = async (client, message) => {
    if (message.author.bot) return;
    let prefix;
    if (message.mentions.has(client.user.id)) {
        await handleMentionMessage(message, client);
    } else if (message.guild) {
        try {
            const result = await mariadbHandler.functions.getGuildPrefix(message.guild.id);
            if (result.length === 1) {
                prefix = result[0].prefix;
            }
        } catch (error) {
            logger.warn('Message: Warning DB error: ' + error);
            prefix = config.commandPrefix;
        }
    } else {
        prefix = config.commandPrefix;
    }
    await handlePrefixMessage(message, prefix, client);
};

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