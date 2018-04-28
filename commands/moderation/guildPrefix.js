const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const mariadbHandler = require('../../handler/util/mariadbHandler');
const cacheHandler = require('../../handler/util/cacheHandler');
const configHandler = require('../../handler/util/configHandler');
const logger = winstonLogHandler.getLogger();

let generalConfig;

module.exports = {
    name: 'guildprefix',
    description: 'Sets the Prefix for the Guild the author is in, if he has the Permissions to do so. If no Prefix is given it will show the current.',
    disabled: false,
    async execute(client, message, args) {
        if (!message.guild) return;
        const guildId = message.guild.id;
        let prefix = args.join(' ');
        if (prefix.length > 0) {
            if (message.member.hasPermission('MANAGE_GUILD')) {
                try {
                    await mariadbHandler.functions.setGuildPrefix(prefix, guildId);
                    cacheHandler.createPrefixCache(guildId, prefix);
                    message.channel.send(`Set the Prefix to **${prefix}**`).catch(error => logger.error(`GuildPrefix: error sending message: ${error}`));
                } catch (error) {
                    logger.error(`GuildPrefix: ${error}`);
                }
            } else {
                message.channel.send('You don\'t have the Permission (MANAGE_GUILD) to set the Prefix for this Server!').catch(error => logger.error(`GuildPrefix: error sending message: ${error}`));
            }
        } else {
            generalConfig = configHandler.getGeneralConfig();
            let prefix = checkCacheAndGetPrefix(guildId);
            try {
                await message.channel.send(`The Prefix is: **${prefix}**`);
            } catch (error) {
                logger.error(`GuildPrefix: Error while trying to send Prefix: ${error}`);
            }
        }
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