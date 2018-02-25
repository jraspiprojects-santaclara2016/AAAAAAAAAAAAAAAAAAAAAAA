const config = require('../../configuration/config');
const winstonLogHandler = require('../../handler/winstonLogHandler');
const mariadbHandler = require('../../handler/mariadbHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'help',
    description: 'Display the help page.',
    execute(client, message) {
        let prefix;
        if (message.guild) {
            mariadbHandler.functions.getGuildPrefix(message.guild.id).then(result => {
                if (result.length === 1) {
                    prefix = result[0].prefix;
                } else {
                    prefix = config.commandPrefix;
                }
            });
        } else {
            prefix = config.commandPrefix;
        }
        const commandCollection = client.commands;
        const text = `\n___**Commands:**___
${commandCollection.map(command => `**-${prefix}${command.name}** - ${command.description}`).join('\n')}`;
        message.author.send(text, { split :true }).catch(error => { logger.error(`help: Error: ${error}`);});
    },
};