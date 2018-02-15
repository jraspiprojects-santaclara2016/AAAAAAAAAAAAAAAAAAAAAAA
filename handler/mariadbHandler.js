const mysql = require('mysql');
const databaseConfig = require('../configuration/databaseConfig.json');
const logHandler = require('../handler/winstonLogHandler');
const logger = logHandler.getLogger();

let pool = mysql.createPool(databaseConfig);

pool.on('acquire', function (connection) {
    logger.verbose('Connection %d acquired', connection.threadId);
});
pool.on('enqueue', function () {
    logger.verbose('Waiting for available connection slot');
});
pool.on('release', function (connection) {
    logger.verbose('Connection %d released', connection.threadId);
});

functions = {
    getLeagueAccounts: function(discordId) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function (err, connection) {
                let selectSummonerNames = `SELECT summonerName, region, isMain FROM summonerNames, discordUser WHERE summonerNames.discordId = discordUser.discordId AND discordUser.discordId = ${connection.escape(discordId)}`;
                connection.query(selectSummonerNames, function (error, results, fields) {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                    connection.release();
                });
            });
        });
    },

    addLeagueAccount: function(summonerName, region, discordId, isMain) {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                let insertDiscordId = `INSERT INTO discordUser (discordId) VALUES (${connection.escape(discordId)})`;
                let insertSummonerName = `INSERT INTO summonerNames (summonerName, region, discordId, isMain) VALUES (${connection.escape(summonerName)}, ${connection.escape(region)}, ${connection.escape(discordId)}, ${connection.escape(isMain)})`;
                connection.query(insertDiscordId, function (error, results, fields) {});
                connection.query(insertSummonerName, function (error, results, fields) {
                    if (error) reject(error);
                    resolve(results);
                });
                connection.release();
            });
        });
    },

    deleteLeagueAccount: function(summonerName, discordId) {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                let deleteSummonerName = `DELETE FROM summonerNames WHERE summonerName = ${connection.escape(summonerName)} AND discordId = ${connection.escape(discordId)}`;
                connection.query(deleteSummonerName, function (error, results, fields) {
                    if(error) reject(error);
                    resolve(results);
                });
                connection.release();
            });
        });
    },
};

module.exports = {
    functions
};



