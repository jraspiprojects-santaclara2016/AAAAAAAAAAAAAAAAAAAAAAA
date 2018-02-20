//Require needed npm modules
const Discord = require('discord.js');
const apiKeys = require('./configuration/apiKeyConfig');

//require logger
const winstonLogHandler = require('./handler/winstonLogHandler');
const logger = winstonLogHandler.createLogger();

//Create shard manager object
const ShardManager = new Discord.ShardingManager('./bot.js', {
    totalShards : 'auto',
    token : apiKeys.discord,
    respawn : true,
});

//spawn new shards
ShardManager.spawn().then(() => {
    logger.info('Shards spawning successful.');
}).catch((error) => {
    logger.error(error);
});

//is emitted every time a new shard is launched
ShardManager.on('launch', shard => logger.info(`Successfully launched shard ${shard.id}`));