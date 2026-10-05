const db = require('./db');

class WorkoutRepository {
  async findAllByUser(userId) {
    return await db.any('SELECT * FROM acquafit.workout WHERE fk_user = $1 ORDER BY day DESC', [userId]);
  }

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM acquafit.workout WHERE id = $1', [id]);
  }

  async create(name, userId) {
    return await db.one('INSERT INTO acquafit.workout (name, fk_user) VALUES ($1, $2) RETURNING *', [name, userId]);
  }

  async updateName(id, name) {
    return await db.oneOrNone('UPDATE acquafit.workout SET name = COALESCE($1, name) WHERE id = $2 RETURNING *', [name, id]);
  }

  async delete(id) {
    return await db.none('DELETE FROM acquafit.workout WHERE id = $1', [id]);
  }
}

module.exports = new WorkoutRepository();
