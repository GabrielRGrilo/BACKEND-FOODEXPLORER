
exports.up = (knex) =>
  knex.schema.createTable('user', (table) => {
    table.increments('id');
    table.text('name');
    table.text('email');
    table.text('password');
    table.boolean('admin');
    table.timestamp('created_at').default(knex.fn.now());
    table.timestamp('updated_at').default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable('user');
