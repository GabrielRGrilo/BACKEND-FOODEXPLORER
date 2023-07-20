exports.up = (knex) =>
  knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.text('name').notNullable();
        table.text('password').notNullable();
        table.text('email').unique().notNullable();
      });
    }
  });

exports.down = (knex) => knex.schema.dropTable('users');
