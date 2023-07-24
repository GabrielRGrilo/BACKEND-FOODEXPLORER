exports.up = (knex) =>
  knex.schema.createTable('dishes', (table) => {
    table.increments('id');
    table
      .integer('user_id')
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');
    table.text('name');
    table.float('price');
    table.text('description');
    table.text('category');
    table.text('image');
    table.timestamp('created_at').default(knex.fn.now());
    table.timestamp('updated_at').default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable('dishes');
