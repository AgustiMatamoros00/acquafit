-- Tabla para ejercicios favoritos de usuarios
CREATE TABLE acquafit.user_favorite_exercise(
    id SERIAL PRIMARY KEY,
    fk_user INTEGER NOT NULL REFERENCES acquafit."user"(id) ON DELETE CASCADE,
    fk_exercise INTEGER NOT NULL REFERENCES acquafit.exercise(id) ON DELETE CASCADE,
    created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(fk_user, fk_exercise)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_user_favorite_exercise_user ON acquafit.user_favorite_exercise(fk_user);
CREATE INDEX idx_user_favorite_exercise_exercise ON acquafit.user_favorite_exercise(fk_exercise); 