// Este archivo muestra la configuración que db.js lee del .env
// NO es necesario editar este archivo, solo es informativo

module.exports = {
    // Configuración para tu SQL Server en Docker
    sqlServer: {
        user: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || 'sapwd',
        server: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 1433,
        database: process.env.DB_NAME || 'acquafit',
        options: {
            encrypt: false,  // false para desarrollo local
            trustServerCertificate: true,
            enableArithAbort: true
        }
    },
    
    // Puerto del servidor Express
    port: process.env.PORT || 3000,
    
    // Clave secreta para JWT
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
};

