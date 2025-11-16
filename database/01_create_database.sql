-- Crear database acquafit
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'acquafit')
BEGIN
    CREATE DATABASE acquafit;
END
GO

-- Cambiar al contexto de la nueva database
USE acquafit;
GO

