require('dotenv').config();

const config = {
    // Base de datos
    db: {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'acquafit',
        host: process.env.DB_HOST || 'database',
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'postgres'
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },

    // Servidor
    server: {
        port: parseInt(process.env.PORT) || 3000
    }
};

module.exports = config;
