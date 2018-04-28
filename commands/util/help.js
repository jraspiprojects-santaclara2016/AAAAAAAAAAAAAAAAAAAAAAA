const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const cacheHandler = require('../../handler/util/cacheHandler');
const mariadbHandler = require('../../handler/util/mariadbHandler');
const configHandler = require('../../handler/util/configHandler');
const logger = winstonLogHandler.getLogger();

let generalConfig;

module.exports = {
    name: 'help',
    description: 'Display the help page.',
    disabled: false,
    async execute(client, message) {
        generalConfig = configHandler.getGeneralConfig();
        let prefix;
        if (message.guild) {
            prefix = await checkCacheAndGetPrefix(message.guild.id);
        } else {
            prefix = generalConfig.commandPrefix;
        }
        const commandCollection = client.commands.filter(function(command) {
            return !command.disabled;
        });
        const text = `\n___**Commands:**___
${commandCollection.map(command => `**-${prefix}${command.name}** - ${command.description}`).join('\n')}`;
        message.author.send(text, { split: true }).catch(error => {
            logger.error(`Help: Error sending message: ${error}`);
        });
    },
};

async function checkCacheAndGetPrefix(guildId) {
    let prefix;
    if (!cacheHandler.getPrefixCache().has(guildId)) {
        prefix = await mariadbHandler.functions.getGuildPrefix(guildId);
        if (!prefix) {
            prefix = generalConfig.commandPrefix;
        }
        cacheHandler.createPrefixCache(guildId, prefix);
    } else {
        prefix = cacheHandler.getPrefixCache().get(guildId).prefix;
    }
    return prefix;
}