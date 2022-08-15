require('dotenv').config()

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS,
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = knex;