const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const mariadbHandler = require('../../handler/util/mariadbHandler');
const configHandler = require('../../handler/util/configHandler');
const logger = winstonLogHandler.getLogger();
const cacheHandler = require('../../handler/util/cacheHandler');

let generalConfig;

module.exports = {
    name: 'showguildprefix',
    description: 'Shows the Prefix for the Guild the message author is in.',
    disabled: false,
    async execute(client, message) {
        generalConfig = configHandler.getGeneralConfig();
        if (!message.guild) return;
        const guildId = message.guild.id;
        let prefix;
        if (cacheHandler.getPrefixCache().has(guildId)) {
            prefix = cacheHandler.getPrefixCache().get(guildId).prefix;
        } else {
            try {
                const result = await mariadbHandler.functions.getGuildPrefix(guildId);
                if (result.length === 1) {
                    prefix = result[0].prefix;
                } else {
                    prefix = generalConfig.commandPrefix;
                    logger.verbose(`ShowGuildPrefix: Use default Prefix ${prefix}`);
                }
            } catch (error) {
                logger.error(`ShowGuildPrefix: ${error.code} ${error.sqlMessage}`);
                prefix = generalConfig.commandPrefix;
            }
        }
        try {
            await message.channel.send(`The Prefix is: **${prefix}**`);
        } catch (error) {
            logger.error(`ShowGuildPrefix: Error while trying to send Prefix: ${error}`);
        }
    },
};