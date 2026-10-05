const db = require('./db');

class UserRepository {
  async findById(id) {
    return await db.oneOrNone('SELECT id, email, name, surname, weight_unit, superadmin FROM acquafit."user" WHERE id = $1', [id]);
  }

  async findAll() {
    return await db.any('SELECT * FROM acquafit."user"');
  }

  async findPublicById(id) {
    return await db.oneOrNone('SELECT id, email, name, surname, weight_unit FROM acquafit."user" WHERE id = $1', [id]);
  }

  async findByEmail(email) {
    return await db.oneOrNone('SELECT * FROM acquafit."user" WHERE email = $1', [email]);
  }

  async findIdByEmail(email) {
    return await db.oneOrNone('SELECT id FROM acquafit."user" WHERE email = $1', [email]);
  }

  async create(email, hashedPassword, name, surname) {
    return await db.one(
      'INSERT INTO acquafit."user" (email, password, name, surname, weight_unit) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, surname',
      [email, hashedPassword, name, surname, 'kg']
    );
  }

  async update(id, name, surname, weightUnit) {
    return await db.one(
      'UPDATE acquafit."user" SET name = COALESCE($1, name), surname = COALESCE($2, surname), weight_unit = COALESCE($3, weight_unit) WHERE id = $4 RETURNING id, email, name, surname, weight_unit',
      [name, surname, weightUnit, id]
    );
  }

  async delete(id) {
    return await db.none('DELETE FROM acquafit."user" WHERE id = $1', [id]);
  }
}

module.exports = new UserRepository();
