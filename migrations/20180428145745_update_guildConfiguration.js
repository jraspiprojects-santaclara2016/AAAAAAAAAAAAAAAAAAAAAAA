exports.up = function(knex) {
    return knex.raw('ALTER TABLE monikadb.guildConfiguration ADD PRIMARY KEY(guildId)');
};

exports.down = function(knex) {
    return knex.raw('ALTER TABLE monikadb.guildConfiguration DROP PRIMARY KEY(guildId)');
};
