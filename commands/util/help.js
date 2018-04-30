const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const cacheHandler = require('../../handler/util/cacheHandler');
const logger = winstonLogHandler.getLogger();

module.exports = {
    name: 'help',
    description: 'Display the help page.',
    disabled: false,
    requireDB: false,
    async execute(client, message) {
        let prefix;
        if (message.guild) {
            prefix = await checkCacheOrGetMention(message.guild.id, client);
        } else {
            prefix = client.user.name;
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

async function checkCacheOrGetMention(guildId, client) {
    if (cacheHandler.getPrefixCache().has(guildId)) return cacheHandler.getPrefixCache().get(guildId).prefix;
    return client.user.name;
}