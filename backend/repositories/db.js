const pgp = require('pg-promise')();

// Configuración de la conexión
const config = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'acquafit',
    host: process.env.DB_HOST || 'database',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'postgres'
};

console.log('Database config:', config);

// Crear la conexión
const db = pgp(config);

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
 