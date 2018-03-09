const dbHandler = require('../../handler/util/mariadbHandler');
const logHandler = require('../../handler/util/winstonLogHandler');
const logger = logHandler.getLogger();

module.exports = {
    name: 'favplaylist',
    description: 'List or set your favorite playlist.',
    disabled: false,
    execute(client, message, args) {
        if(args.length === 0) {
            dbHandler.functions.getFavPlaylist(message.author.id).then(data => {
                message.channel.send(`Your current favPlaylist is: ${data[0].favPlaylist}`);
            }).catch(error => {
                logger.error(`favPlaylist: ${error}`);
            });
        }
        if(args.length === 1) {
            dbHandler.functions.setFavPlaylist(args[0], message.author.id);
            message.channel.send(`I set your fav playlist to: ${args[0]}`);
        }
    },
};