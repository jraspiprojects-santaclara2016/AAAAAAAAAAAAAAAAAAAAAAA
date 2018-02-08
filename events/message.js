const config = require('../configuration/config.json');
const errorEmbedHandler = require('../handler/discordErrorEmbedHandler');

exports.run = (client, logger, message) => {
    if (message.author.bot) return;
    if(message.content.indexOf(config.commandPrefix) !== 0) return;
    //This is the best way to define args. Trust me.
    const args = message.content.slice(config.commandPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    logger.info('Command received: ' + command);
    //This matches an incoming command with right command prefix to a file located in /commands/.
    try {
        logger.verbose('Try to require: ' + command + '.js');
        let commandFile = require(`../commands/${command}.js`);
        commandFile.run(client, message, args, logger);
        logger.verbose(command + '.js has been required and executed!');
    } catch (err) {
        logger.verbose('The file: ' + command + '.js does not exist and therefore cannot be required!');
        let errorMessage = 'The command "' + command + '" does not exist.';
        errorEmbedHandler.run(client, message, errorMessage);
    }
};