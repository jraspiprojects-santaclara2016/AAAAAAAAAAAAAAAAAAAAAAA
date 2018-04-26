const Discord = require('discord.js');
const winstonLogHandler = require('./handler/util/winstonLogHandler');
const logger = winstonLogHandler.createLogger('Sharder');
const secretHandler = require('./handler/util/secretHandler');

const ShardManager = new Discord.ShardingManager('./bot.js', {
    totalShards: 'auto',
    token: secretHandler.getApiKey('DISCORD_KEY'),
    respawn: true,
});

ShardManager.spawn().then(() => {
    logger.info('index: Shards spawning successful.');
}).catch((error) => {
    logger.error(`index: Error spawning shards: ${error}`);
});

ShardManager.on('launch', shard => logger.info(`index: Successfully launched shard ${shard.id}`));