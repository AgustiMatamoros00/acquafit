const db = require('./db');

class ExerciseRepository {
    async findAll() {
        return await db.any('SELECT * FROM acquafit.exercise ORDER BY name');
    }

    async findById(id) {
        return await db.oneOrNone('SELECT * FROM acquafit.exercise WHERE id = $1', [id]);
    }

    async findByMuscle(muscle) {
        return await db.any('SELECT * FROM acquafit.exercise WHERE muscle = $1 ORDER BY name', [muscle]);
    }

    async create(name, muscle, restTime) {
        return await db.one(
            'INSERT INTO acquafit.exercise (name, muscle, rest_time) VALUES ($1, $2, $3) RETURNING *',
            [name, muscle, restTime || null]
        );
    }

    async update(id, name, muscle, restTime) {
        return await db.oneOrNone(
            'UPDATE acquafit.exercise SET name = COALESCE($1, name), muscle = COALESCE($2, muscle), rest_time = COALESCE($3, rest_time) WHERE id = $4 RETURNING *',
            [name, muscle, restTime, id]
        );
    }

    async delete(id) {
        return await db.oneOrNone(
            'DELETE FROM acquafit.exercise WHERE id = $1 RETURNING id',
            [id]
        );
    }

    async isInUseByWorkout(id) {
        return await db.oneOrNone(
            'SELECT 1 FROM acquafit.workout_x_exercise WHERE fk_exercise = $1 LIMIT 1',
            [id]
        );
    }

    // Favoritos
    async findFavoritesByUser(userId) {
        return await db.any(
            `SELECT e.*, ufe.created_at as favorited_at 
             FROM acquafit.exercise e 
             INNER JOIN acquafit.user_favorite_exercise ufe ON e.id = ufe.fk_exercise 
             WHERE ufe.fk_user = $1 
             ORDER BY ufe.created_at DESC`,
            [userId]
        );
    }

    async isFavorite(userId, exerciseId) {
        return await db.oneOrNone(
            'SELECT 1 FROM acquafit.user_favorite_exercise WHERE fk_user = $1 AND fk_exercise = $2',
            [userId, exerciseId]
        );
    }

    async addFavorite(userId, exerciseId) {
        return await db.none(
            'INSERT INTO acquafit.user_favorite_exercise (fk_user, fk_exercise) VALUES ($1, $2) ON CONFLICT (fk_user, fk_exercise) DO NOTHING',
            [userId, exerciseId]
        );
    }

    async removeFavorite(userId, exerciseId) {
        return await db.oneOrNone(
            'DELETE FROM acquafit.user_favorite_exercise WHERE fk_user = $1 AND fk_exercise = $2 RETURNING id',
            [userId, exerciseId]
        );
    }
}

module.exports = new ExerciseRepository();