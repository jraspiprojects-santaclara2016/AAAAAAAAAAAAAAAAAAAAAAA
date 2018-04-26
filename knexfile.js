const secretHandler = require('./handler/util/secretHandler.js');
const databaseSecret = secretHandler.getDatabaseSecrets();
module.exports = {
    client: 'mysql',
    connection: {
        host: databaseSecret.host,
        user: databaseSecret.user,
        password: databaseSecret.password,
        database: databaseSecret.database,
    },
};
