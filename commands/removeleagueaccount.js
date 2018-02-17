const mariadbHandler = require('../handler/mariadbHandler');

exports.run = (client, message, args, logger) => {
    mariadbHandler.functions.deleteLeagueAccount(args.join(' ').toUpperCase(), message.author.id).then(data => {
        console.log(data);
        message.channel.send(`I removed ${args.join(' ')} from the database`);
    }).catch(error => {
        console.log(error);
    });
};