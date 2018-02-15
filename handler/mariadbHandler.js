const mysql = require('mysql');
const databaseConfig = require('../configuration/databaseConfig.json');

let config = databaseConfig;

let connection;

functions = {
    getLeagueAccounts: function(discordId) {
        return new Promise(function(resolve, reject) {
            connection = mysql.createConnection(config);
            connection.connect();
            connection.query('SELECT summonerName, region FROM summonerNames, discordUser WHERE summonerNames.discordId = discordUser.discordId AND discordUser.discordId = ?', discordId, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
            connection.end();
        });
    },

    addLeagueAccount: function(summonerName, region, discordId) {
        return new Promise(function (resolve, reject) {
            connection = mysql.createConnection(config);
            connection.connect();
            connection.query('INSERT INTO discordUser (discordId) VALUES (?)', discordId, function (error, results, fields) {
                if (error) {

                }
            });
            connection.query('INSERT INTO summonerNames (summonerName, region, discordId) VALUES (?, ?, ?)', [summonerName, region, discordId] , function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
            connection.end();
        });
    }

};

module.exports = {
    functions
};



