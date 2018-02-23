const config = require('../configuration/config.json');
const errorEmbedHandler = require('../handler/discordErrorEmbedHandler');
const winstonLogHandler = require('../handler/winstonLogHandler');
const mariadbHandler = require('../handler/mariadbHandler');
const logger = winstonLogHandler.getLogger();


exports.run = async (client, message) => {
    if (message.author.bot) return;
    let prefix;
    if (message.guild) {
        try {
            const result = await mariadbHandler.functions.getGuildPrefix(message.guild.id);
            if(result.length === 0) {
                prefix = result[0].prefix;
            }
        } catch (error) {
            //TODO Error
            prefix = config.commandPrefix;
        }
    } else {
        prefix = config.commandPrefix;
    }
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
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
};