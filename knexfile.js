const secret = require('./configuration/secrets');
module.exports = {
    client: 'mysql',
    connection: {
        host: secret.database.host,
        user: secret.database.user,
        password: secret.database.password,
        database: secret.database.database,
    },
};
