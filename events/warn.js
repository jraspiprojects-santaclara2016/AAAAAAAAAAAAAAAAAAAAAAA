const config = require('../configuration/config');

exports.run = (client, args) => {
    client.fetchUser(config.ownerID).then(user => {
        user.send(args);
    }).catch((error) => {
        console.log(args);
    });
};