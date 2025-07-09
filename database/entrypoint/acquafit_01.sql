CREATE TYPE acquafit.weight_units AS ENUM('kg', 'lbs');
CREATE TYPE acquafit.gym_muscles AS ENUM (
    'Lats',            -- Dorsales
    'Chest',           -- Pectorales
    'Quadriceps',      -- Cuadriceps
    'Biceps',          -- Biceps
    'Triceps',         -- Triceps
    'Trapezoids',       -- Trapecios
    'Glutes',          -- Glúteos
    'Abs',             -- Abdominales
    'Hamstrings',      -- Isquiotibiales
    'Calves',          -- Gemelos
    'Deltoids',        -- Deltoides
    'Forearms',        -- Antebrazos
    'Rhomboids'        -- Romboides
);

CREATE TABLE acquafit."user"(
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL, -- name with 'quotes' because is a postgres variable
    surname TEXT NOT NULL,
    password TEXT NOT NULL,
    weight_unit acquafit.weight_units NOT NULL,
    superadmin BOOLEAN NULL DEFAULT FALSE
);

CREATE TABLE acquafit.user_token(
    id SERIAL PRIMARY KEY,
    fk_user INTEGER NOT NULL REFERENCES acquafit."user"(id),
    token TEXT NOT NULL,
    last_action_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE acquafit.workout(
    id SERIAL PRIMARY KEY,
    "name" TEXT DEFAULT NULL,
    fk_user INTEGER NOT NULL REFERENCES acquafit."user"(id),
    day TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE acquafit.exercise(
    id SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "muscle" acquafit.gym_muscles NOT NULL,
    rest_time INTEGER DEFAULT NULL
);

CREATE TABLE acquafit.workout_x_exercise(
    id SERIAL PRIMARY KEY,
    fk_workout INTEGER NOT NULL REFERENCES acquafit.workout(id),
    fk_exercise INTEGER NOT NULL REFERENCES acquafit.exercise(id),
    exercise_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE acquafit.set(
    id SERIAL PRIMARY KEY,
    "weight" INTEGER NOT NULL,
    repetitions INTEGER NOT NULL,
    rir INTEGER DEFAULT NULL,
    fk_workout_x_exercise INTEGER NOT NULL REFERENCES acquafit.workout_x_exercise(id) 
);

CREATE TABLE acquafit.note(
    id SERIAL PRIMARY KEY,
    fk_workout INTEGER DEFAULT NULL REFERENCES acquafit.workout(id),
    fk_exercise INTEGER DEFAULT NULL REFERENCES acquafit.exercise(id),
    fk_set INTEGER DEFAULT NULL REFERENCES acquafit.set(id),
    "note" TEXT DEFAULT NULL
);

CREATE INDEX idx_user_token_user ON acquafit.user_token(fk_user);
CREATE INDEX idx_workout_user ON acquafit.workout(fk_user);
CREATE INDEX idx_set_workout_exercise ON acquafit.set(fk_workout_x_exercise);