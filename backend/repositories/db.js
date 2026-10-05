const pgp = require('pg-promise')();
const config = require('../config');

console.log('Database config:', config.db);

// Crear la conexión
const db = pgp(config.db);

// Probar la conexión
db.connect()
    .then(obj => {
        console.log('Database connection successful');
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.error('Database connection error:', error);
    });

module.exports = db;