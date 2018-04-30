const Discord = require('discord.js');
const winstonLogHandler = require('../../handler/util/winstonLogHandler');
const mariadbHandler = require('../../handler/util/mariadbHandler');
const cacheHandler = require('../../handler/util/cacheHandler');
const configHandler = require('../../handler/util/configHandler');
const messageHandler = require('../../handler/command/discordMessageHandler');
const logger = winstonLogHandler.getLogger();

let generalConfig;

module.exports = {
    name: 'guildprefix',
    description: 'Sets the Prefix for the Guild the author is in, if he has the Permissions to do so. If no Prefix is given it will show the current.',
    disabled: false,
    requireDB: true,
    async execute(client, message, args) {
        if (!message.guild) return;
        const guildId = message.guild.id;
        generalConfig = configHandler.getGeneralConfig();
        if (args.length > 0) {
            const newPrefix = args.join(' ');
            if (message.member.hasPermission('MANAGE_GUILD')) {
                await setNewPrefix(newPrefix, guildId, message.channel);
            } else {
                sendPermissionDeniedEmbed(message.channel);
            }
        } else {
            const prefix = await checkCacheAndGetPrefix(guildId);
            sendPrefixEmbed(prefix, message.channel);
        }
    },
};

async function setNewPrefix(prefix, guildId, channel) {
    logger.debug(`GuildPrefix: Set new Prefix: ${prefix} for guild: ${guildId}`);
    if (await mariadbHandler.functions.setGuildPrefix(prefix, guildId)) {
        cacheHandler.createPrefixCache(guildId, prefix);
        sendNewPrefixEmbed(prefix, channel);
    } else {
        logger.error(`GuildPrefix: Error setting new Prefix: ${prefix} for guild: ${guildId}`);
    }
}

async function checkCacheAndGetPrefix(guildId) {
    let prefix;
    if (cacheHandler.getPrefixCache().has(guildId)) return cacheHandler.getPrefixCache().get(guildId).prefix;
    if (await mariadbHandler.functions.checkDatabase()) {
        prefix = generalConfig.commandPrefix;
    } else {
        prefix = await mariadbHandler.functions.getGuildPrefix(guildId);
        if (!prefix) {
            prefix = generalConfig.commandPrefix;
        }
    }
    cacheHandler.createPrefixCache(guildId, prefix);
    return prefix;
}

function sendPrefixEmbed(prefix, channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Guild Prefix:')
        .setColor('DARK_GREEN')
        .addField('❯Current Prefix: ', `**${prefix}**`)
        .setTimestamp()
        .setFooter(`By ${generalConfig.botName}`);
    messageHandler.sendEmbed('prefix', embed, channel);
}

function sendNewPrefixEmbed(prefix, channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Guild Prefix:')
        .setColor('DARK_GREEN')
        .addField('❯New Prefix', `**${prefix}**`)
        .setTimestamp()
        .setFooter(`By ${generalConfig.botName}`);
    messageHandler.sendEmbed('prefix', embed, channel);
}

function sendPermissionDeniedEmbed(channel) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Guild Prefix:')
        .setColor('DARK_RED')
        .addField('You don\'t have the Permission (MANAGE_GUILD) to set the Prefix for this Server!')
        .setTimestamp()
        .setFooter(`By ${generalConfig.botName}`);
    messageHandler.sendEmbed('prefix', embed, channel);
}