const dbHandler = require('../../handler/util/mariadbHandler');
const logHandler = require('../../handler/util/winstonLogHandler');
const logger = logHandler.getLogger();
const discordCustomEmbedHandler = require('../../handler/command/discordCustomEmbedHandler');

module.exports = {
    name: 'favplaylist',
    description: 'List or set your favorite playlist.',
    disabled: false,
    execute(client, message, args) {
        if (args.length === 0) {
            dbHandler.functions.getFavPlaylist(message.author.id).then(data => {
                discordCustomEmbedHandler.run(client, 'Favorite Playlist', [{
                    name: 'Your favorite Playlist is:',
                    value: `${data[0].favPlaylist}`,
                }], message.channel);
            }).catch(error => {
                logger.error(`favPlaylist: ${error}`);
            });
        }
        if (args.length === 1) {
            dbHandler.functions.setFavPlaylist(args[0], message.author.id);
            discordCustomEmbedHandler.run(client, 'Favorite Playlist', [{
                name: 'I set your fav playlist to:',
                value: `${args[0]}`,
            }], message.channel);
        }
    },
};