const mariadbHandler = require('../../handler/mariadbHandler');

module.exports = {
    name: 'removeleagueaccount',
    description: 'Delete the link between the LeagueOfLegends and the Discord account',
    execute(client, message, args, logger) {
        mariadbHandler.functions.deleteLeagueAccount(args.join(' ').toUpperCase(), message.author.id).then(data => {
            console.log(data);
            message.channel.send(`I removed ${args.join(' ')} from the database`);
        }).catch(error => {
            console.log(error);
        });
    },
};