const db = require('./db');

class WorkoutXExerciseRepository {
    async findByIdWithDetails(workoutExerciseId) {
        return await db.oneOrNone(
            `SELECT 
                wxe.id as workout_exercise_id,
                wxe.exercise_at,
                w.id as workout_id,
                w.name as workout_name,
                w.day as workout_day,
                w.fk_user,
                e.id as exercise_id,
                e.name as exercise_name,
                e.muscle as exercise_muscle,
                e.rest_time as exercise_rest_time
             FROM acquafit.workout_x_exercise wxe
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             INNER JOIN acquafit.exercise e ON wxe.fk_exercise = e.id
             WHERE wxe.id = $1`,
            [workoutExerciseId]
        );
    }

    async findWorkoutByIdAndUser(workoutId, userId) {
        return await db.oneOrNone(
            'SELECT id FROM acquafit.workout WHERE id = $1 AND fk_user = $2',
            [workoutId, userId]
        );
    }

    async findExerciseById(exerciseId) {
        return await db.oneOrNone(
            'SELECT id, name FROM acquafit.exercise WHERE id = $1',
            [exerciseId]
        );
    }

    async findExisting(workoutId, exerciseId) {
        return await db.oneOrNone(
            'SELECT 1 FROM acquafit.workout_x_exercise WHERE fk_workout = $1 AND fk_exercise = $2',
            [workoutId, exerciseId]
        );
    }

    async create(workoutId, exerciseId) {
        return await db.one(
            'INSERT INTO acquafit.workout_x_exercise (fk_workout, fk_exercise) VALUES ($1, $2) RETURNING *',
            [workoutId, exerciseId]
        );
    }

    async findByIdWithOwner(workoutExerciseId) {
        return await db.oneOrNone(
            `SELECT wxe.*, w.fk_user FROM acquafit.workout_x_exercise wxe
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE wxe.id = $1`,
            [workoutExerciseId]
        );
    }

    async update(workoutExerciseId, exerciseAt) {
        return await db.one(
            'UPDATE acquafit.workout_x_exercise SET exercise_at = COALESCE($1, exercise_at) WHERE id = $2 RETURNING *',
            [exerciseAt, workoutExerciseId]
        );
    }

    async delete(workoutExerciseId) {
        return await db.none(
            'DELETE FROM acquafit.workout_x_exercise WHERE id = $1',
            [workoutExerciseId]
        );
    }
}

module.exports = new WorkoutXExerciseRepository();
