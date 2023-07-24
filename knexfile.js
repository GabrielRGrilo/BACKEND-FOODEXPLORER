const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.db'),
    },
    migrations: {
      directory: path.resolve(
        __dirname,
        'src',
        'database',
        'knex',
        'migrations'
      ),
    },
    useNullAsDefault: true,
    // debug: true
  },
};
