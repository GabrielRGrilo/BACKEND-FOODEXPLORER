exports.up = (knex) =>
  knex.schema.createTable('favorites', (table) => {
    table.increments('id');
    table.integer('user_id').references('id').inTable('user');
    table
      .integer('dishes_id')
      .references('id')
      .inTable('dishes')
      .onDelete('CASCADE');
  });

exports.down = (knex) => knex.schema.dropTable('favorites');
