const sql = require('mssql');

// Configuración de la conexión a SQL Server
const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'sapwd',
    server: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_NAME || 'acquafit',
    options: {
        encrypt: false, // Para desarrollo local
        trustServerCertificate: true, // Para desarrollo local
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

console.log('Database config:', {
    user: config.user,
    server: config.server,
    port: config.port,
    database: config.database
});

// Crear el pool de conexiones
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server successfully');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        throw err;
    });

// Helper functions para mantener compatibilidad con el código existente
const db = {
    // Ejecutar query y obtener múltiples resultados
    any: async (query, params = []) => {
        const pool = await poolPromise;
        const request = pool.request();
        
        // Agregar parámetros (convertir de $1, $2 a @param1, @param2)
        params.forEach((param, index) => {
            request.input(`param${index + 1}`, param);
        });
        
        // Reemplazar placeholders de PostgreSQL ($1, $2) por SQL Server (@param1, @param2)
        let sqlQuery = query;
        params.forEach((_, index) => {
            sqlQuery = sqlQuery.replace(`$${index + 1}`, `@param${index + 1}`);
        });
        
        const result = await request.query(sqlQuery);
        return result.recordset || [];
    },
    
    // Ejecutar query y obtener un solo resultado o null
    oneOrNone: async (query, params = []) => {
        const pool = await poolPromise;
        const request = pool.request();
        
        params.forEach((param, index) => {
            request.input(`param${index + 1}`, param);
        });
        
        let sqlQuery = query;
        params.forEach((_, index) => {
            sqlQuery = sqlQuery.replace(`$${index + 1}`, `@param${index + 1}`);
        });
        
        const result = await request.query(sqlQuery);
        return result.recordset && result.recordset.length > 0 ? result.recordset[0] : null;
    },
    
    // Ejecutar query y obtener exactamente un resultado (lanza error si no hay resultados)
    one: async (query, params = []) => {
        const pool = await poolPromise;
        const request = pool.request();
        
        params.forEach((param, index) => {
            request.input(`param${index + 1}`, param);
        });
        
        let sqlQuery = query;
        params.forEach((_, index) => {
            sqlQuery = sqlQuery.replace(`$${index + 1}`, `@param${index + 1}`);
        });
        
        const result = await request.query(sqlQuery);
        if (!result.recordset || result.recordset.length === 0) {
            throw new Error('No data returned from query');
        }
        return result.recordset[0];
    },
    
    // Ejecutar query sin esperar resultados
    none: async (query, params = []) => {
        const pool = await poolPromise;
        const request = pool.request();
        
        params.forEach((param, index) => {
            request.input(`param${index + 1}`, param);
        });
        
        let sqlQuery = query;
        params.forEach((_, index) => {
            sqlQuery = sqlQuery.replace(`$${index + 1}`, `@param${index + 1}`);
        });
        
        await request.query(sqlQuery);
    }
};

module.exports = db;

