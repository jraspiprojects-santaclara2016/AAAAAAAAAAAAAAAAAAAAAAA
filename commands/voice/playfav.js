const play = require('./play');
const dbHandler = require('../../handler/util/mariadbHandler');
const logHandler = require('../../handler/util/winstonLogHandler');
const logger = logHandler.getLogger();

module.exports = {
    name: 'playfav',
    description: 'Play your favorite playlist.',
    execute(client, message, args) {
        if(args.length === 0) {
            dbHandler.functions.getFavPlaylist(message.author.id).then(data => {
                if(data[0].favPlaylist) {
                    play.execute(client, message, [data[0].favPlaylist]);
                }
            }).catch(error => {
                logger.error(error);
            });
        }
    },
};