exports.up = function(knex) {
    return knex.schema.createTable('discordUser', function(table) {
        table.specificType('discordId', 'bigint(20) unsigned').notNullable();
        table.specificType('favPlaylist', 'varchar(200)').defaultTo('NULL');
        table.specificType('enableLiveGameStats', 'tinyint(1)').notNullable().defaultTo(0);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('discordUser');
};