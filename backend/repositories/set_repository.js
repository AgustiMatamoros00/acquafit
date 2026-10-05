const db = require('./db');

class SetRepository {
    async findByIdWithDetails(setId) {
        return await db.oneOrNone(
            `SELECT 
                s.*,
                e.name as exercise_name,
                e.muscle as exercise_muscle,
                wxe.id as workout_exercise_id,
                wxe.exercise_at,
                w.id as workout_id,
                w.name as workout_name,
                w.fk_user
             FROM acquafit.set s
             INNER JOIN acquafit.workout_x_exercise wxe ON s.fk_workout_x_exercise = wxe.id
             INNER JOIN acquafit.exercise e ON wxe.fk_exercise = e.id
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE s.id = $1`,
            [setId]
        );
    }

    async findWorkoutExerciseWithOwner(workoutExerciseId) {
        return await db.oneOrNone(
            `SELECT wxe.*, w.fk_user 
             FROM acquafit.workout_x_exercise wxe
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE wxe.id = $1`,
            [workoutExerciseId]
        );
    }

    async create(weight, repetitions, rir, workoutExerciseId) {
        return await db.one(
            'INSERT INTO acquafit.set (weight, repetitions, rir, fk_workout_x_exercise) VALUES ($1, $2, $3, $4) RETURNING *',
            [weight, repetitions, rir || null, workoutExerciseId]
        );
    }

    async findByIdWithOwner(setId) {
        return await db.oneOrNone(
            `SELECT s.*, w.fk_user FROM acquafit.set s
             INNER JOIN acquafit.workout_x_exercise wxe ON s.fk_workout_x_exercise = wxe.id
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE s.id = $1`,
            [setId]
        );
    }

    async update(setId, weight, repetitions, rir) {
        return await db.one(
            'UPDATE acquafit.set SET weight = COALESCE($1, weight), repetitions = COALESCE($2, repetitions), rir = COALESCE($3, rir) WHERE id = $4 RETURNING *',
            [weight, repetitions, rir, setId]
        );
    }

    async delete(setId) {
        return await db.none('DELETE FROM acquafit.set WHERE id = $1', [setId]);
    }
}

module.exports = new SetRepository();
