const config = require('../../configuration/config');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'help',
    description: 'Display the help page.',
    execute(client, message) {
        const commandCollection = client.commands;
        const text = `\n___**Commands:**___
${commandCollection.map(command => `**-${config.commandPrefix}${command.name}** - ${command.description}`).join('\n')}`;
        message.author.send(text, { split :true }).catch(error => { logger.error(`help: Error: ${error}`);});
    },
};