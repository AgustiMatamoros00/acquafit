-- Script para verificar la conexión a SQL Server
-- Ejecuta esto primero para confirmar que puedes conectarte

-- Información del servidor
SELECT 
    @@VERSION as 'SQL Server Version',
    @@SERVERNAME as 'Server Name',
    GETDATE() as 'Current Date/Time';

-- Ver bases de datos existentes
SELECT name, database_id, create_date
FROM sys.databases
ORDER BY name;

-- Ver si la database acquafit ya existe
SELECT 
    CASE WHEN EXISTS (SELECT * FROM sys.databases WHERE name = 'acquafit')
        THEN 'La database acquafit YA EXISTE'
        ELSE 'La database acquafit NO existe (está bien, se creará)'
    END as 'Status Database';

-- Si la database existe, cambiar al contexto y ver tablas
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'acquafit')
BEGIN
    USE acquafit;
    SELECT 
        TABLE_SCHEMA,
        TABLE_NAME,
        TABLE_TYPE
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'dbo'
    ORDER BY TABLE_NAME;
END

PRINT '✅ Conexión exitosa a SQL Server';

