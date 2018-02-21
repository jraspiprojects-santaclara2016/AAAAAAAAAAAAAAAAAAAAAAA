const Discord = require('discord.js');
const apiKeys = require('./configuration/apiKeyConfig');

const winstonLogHandler = require('./handler/winstonLogHandler');
const logger = winstonLogHandler.createLogger();

const ShardManager = new Discord.ShardingManager('./bot.js', {
    totalShards : 'auto',
    token : apiKeys.discord,
    respawn : true,
});

ShardManager.spawn().then(() => {
    logger.info('Shards spawning successful.');
}).catch((error) => {
    logger.error(error);
});

ShardManager.on('launch', shard => logger.info(`Successfully launched shard ${shard.id}`));