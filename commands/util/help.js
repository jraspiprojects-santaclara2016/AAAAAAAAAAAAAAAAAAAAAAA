const config = require('../../configuration/config');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const cacheHandler = require('../../handler/util/cacheHandler');
const prefixCache = cacheHandler.getPrefixCache();
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'help',
    description: 'Display the help page.',
    execute(client, message) {
        let prefix;
        if (message.guild) {
            if (prefixCache.has(message.guild.id)) {
                prefix = prefixCache.get(message.guild.id).prefix;
            } else {
                prefix = config.commandPrefix;
            }
        } else {
            prefix = config.commandPrefix;
        }
        const commandCollection = client.commands;
        const text = `\n___**Commands:**___
${commandCollection.map(command => `**-${prefix}${command.name}** - ${command.description}`).join('\n')}`;
        message.author.send(text, { split: true }).catch(error => {
            logger.error(`Help: Error sending message: ${error}`);
        });
    },
};