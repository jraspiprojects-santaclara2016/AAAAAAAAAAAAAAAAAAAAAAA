const config = require('../configuration/config.json');
const errorEmbedHandler = require('../handler/discordErrorEmbedHandler');
const winstonLogHandler = require('../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();


exports.run = async (client, message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(config.commandPrefix) !== 0) return;
    const args = message.content.slice(config.commandPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    logger.info('Command received: ' + command);
    if(!client.commands.has(command)) return errorEmbedHandler.run(client, message, `${command} doesn't exist.`);
    try {
        await client.commands.get(command).execute(client, message, args);
        logger.info(`${command} executed successfully.`);
    } catch (error) {
        errorEmbedHandler.run(client, message, `I could not run the ${command} command. Please contact the bot Owner.`);
        console.log(error);
    }
};