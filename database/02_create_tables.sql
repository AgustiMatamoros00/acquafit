-- Script de creación de tablas para SQL Server
-- Equivalente a acquafit_01.sql de PostgreSQL

-- Usar la database acquafit
USE acquafit;
GO

-- Tabla de usuarios (usando schema dbo por defecto)
CREATE TABLE dbo.[USER](
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    [name] NVARCHAR(255) NOT NULL,
    surname NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    weight_unit NVARCHAR(10) NOT NULL CHECK (weight_unit IN ('kg', 'lbs')),
    superadmin BIT NULL DEFAULT 0
);
GO

-- Tabla de tokens de usuario
CREATE TABLE dbo.USER_TOKEN(
    id INT IDENTITY(1,1) PRIMARY KEY,
    fk_user INT NOT NULL REFERENCES dbo.[USER](id) ON DELETE CASCADE,
    token NVARCHAR(MAX) NOT NULL,
    last_action_at DATETIME2(0) DEFAULT GETDATE()
);
GO

-- Tabla de workouts
CREATE TABLE dbo.WORKOUT(
    id INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) DEFAULT NULL,
    fk_user INT NOT NULL REFERENCES dbo.[USER](id) ON DELETE CASCADE,
    day DATETIME2(0) DEFAULT GETDATE() NOT NULL
);
GO

-- Tabla de ejercicios
CREATE TABLE dbo.EXERCISE(
    id INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    muscle NVARCHAR(50) NOT NULL CHECK (muscle IN (
        'Lats', 'Chest', 'Quadriceps', 'Biceps', 'Triceps', 
        'Trapezoids', 'Glutes', 'Abs', 'Hamstrings', 'Calves', 
        'Deltoids', 'Forearms', 'Rhomboids'
    )),
    rest_time INT DEFAULT NULL
);
GO

-- Tabla de relación workout x exercise
CREATE TABLE dbo.WORKOUT_X_EXERCISE(
    id INT IDENTITY(1,1) PRIMARY KEY,
    fk_workout INT NOT NULL REFERENCES dbo.WORKOUT(id) ON DELETE CASCADE,
    fk_exercise INT NOT NULL REFERENCES dbo.EXERCISE(id) ON DELETE CASCADE,
    exercise_at DATETIME2(0) DEFAULT GETDATE() NOT NULL
);
GO

-- Tabla de sets
CREATE TABLE dbo.[SET](
    id INT IDENTITY(1,1) PRIMARY KEY,
    [weight] INT NOT NULL,
    repetitions INT NOT NULL,
    rir INT DEFAULT NULL,
    fk_workout_x_exercise INT NOT NULL REFERENCES dbo.WORKOUT_X_EXERCISE(id) ON DELETE CASCADE
);
GO

-- Tabla de notas
-- NOTA: Usamos SET NULL en lugar de CASCADE para evitar ciclos de múltiples rutas de cascada
CREATE TABLE dbo.NOTE(
    id INT IDENTITY(1,1) PRIMARY KEY,
    fk_workout INT DEFAULT NULL REFERENCES dbo.WORKOUT(id) ON DELETE SET NULL,
    fk_exercise INT DEFAULT NULL REFERENCES dbo.EXERCISE(id) ON DELETE SET NULL,
    fk_set INT DEFAULT NULL REFERENCES dbo.[SET](id) ON DELETE SET NULL,
    note NVARCHAR(MAX) DEFAULT NULL
);
GO

-- Crear índices
CREATE INDEX idx_user_token_user ON dbo.USER_TOKEN(fk_user);
CREATE INDEX idx_workout_user ON dbo.WORKOUT(fk_user);
CREATE INDEX idx_set_workout_exercise ON dbo.[SET](fk_workout_x_exercise);
GO

