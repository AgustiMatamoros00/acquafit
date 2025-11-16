-- Tabla para ejercicios favoritos de usuarios
-- Equivalente a acquafit_02.sql de PostgreSQL

-- Usar la database acquafit
USE acquafit;
GO

CREATE TABLE dbo.USER_FAVORITE_EXERCISE(
    id INT IDENTITY(1,1) PRIMARY KEY,
    fk_user INT NOT NULL REFERENCES dbo.[USER](id) ON DELETE CASCADE,
    fk_exercise INT NOT NULL REFERENCES dbo.EXERCISE(id) ON DELETE CASCADE,
    created_at DATETIME2(0) DEFAULT GETDATE(),
    CONSTRAINT UQ_user_exercise UNIQUE(fk_user, fk_exercise)
);
GO

-- Índices para mejorar rendimiento
CREATE INDEX idx_user_favorite_exercise_user ON dbo.USER_FAVORITE_EXERCISE(fk_user);
CREATE INDEX idx_user_favorite_exercise_exercise ON dbo.USER_FAVORITE_EXERCISE(fk_exercise);
GO

