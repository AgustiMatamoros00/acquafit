var express = require('express');
var router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas de usuarios
router.use(authenticateToken);

/* GET users listing. */
router.get('/', async function(req, res, next) {
    console.log(req.user);
    if (req.user.superadmin) {
        const users = await req.app.locals.db.any('SELECT * FROM acquafit."user"');
        res.json({
            users: users
        });
    } else {
        return res.status(403).json({ error: 'You are not allowed to access this endpoint' });
    }
});

// Obtener un usuario específico
router.get('/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        
        // Verificar que el usuario solo puede ver su propio perfil (a menos que sea superadmin)
        if (id !== req.user.id.toString() && !req.user.superadmin) {
            return res.status(403).json({ 
                error: 'UNAUTHORIZED_ACCESS',
                message: 'Access denied: You are not authorized to view this user\'s information'
            });
        }

        const user = await req.app.locals.db.oneOrNone(
            'SELECT id, email, name, surname, weight_unit FROM acquafit."user" WHERE id = $1',
            [id]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User retrieved successfully',
            user: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Ruta para actualizar usuario
router.patch('/:id', async function(req, res) {
  try {
      const { id } = req.params;
      const { name, surname, weight_unit } = req.body;

      if (id !== req.user.id.toString()) {
        return res.status(403).json({ 
            error: 'UNAUTHORIZED_ACCESS',
            message: 'Access denied: You are not authorized to update this user\'s information'
        });
      }

      const updatedUser = await req.app.locals.db.one(
          'UPDATE acquafit."user" SET name = COALESCE($1, name), surname = COALESCE($2, surname), weight_unit = COALESCE($3, weight_unit) WHERE id = $4 RETURNING id, email, name, surname, weight_unit',
          [name, surname, weight_unit, id]
      );

      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json({
          message: 'User updated successfully',
          user: updatedUser
      });
  } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async function(req, res, next) {
    try{
      const { id } = req.params;
      if (id !== req.user.id.toString() && !req.user.superadmin) {
        return res.status(403).json({ 
            error: 'UNAUTHORIZED_ACCESS',
            message: 'Access denied: You are not authorized to delete this user\'s account'
        });
      }
      await req.app.locals.db.none('DELETE FROM acquafit."user" WHERE id = $1', [id]);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoints que no pueden ser usados por el usuario
router.post('/', function(req, res, next) {
    res.status(405).json({ error: 'Method not allowed' });
});

module.exports = router;
