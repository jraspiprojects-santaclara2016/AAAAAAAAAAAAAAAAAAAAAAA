exports.up = function(knex) {
    return knex.schema.createTable('guildConfiguration', function(table) {
        table.specificType('guildId', 'bigint(20) unsigned').notNullable();
        table.specificType('prefix', 'varchar(200)').notNullable().defaultTo('!m.');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('guildConfiguration');
};