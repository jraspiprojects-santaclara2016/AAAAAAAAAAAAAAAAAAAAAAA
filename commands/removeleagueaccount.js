const mariadbHandler = require('../handler/mariadbHandler');

exports.run = (client, message, args, logger) => {
    mariadbHandler.functions.deleteLeagueAccount(args.join(' ').toUpperCase(), message.author.id).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    });
};