var express = require('express');
var router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/user_controller');

// Aplicar middleware de autenticación a todas las rutas de usuarios
router.use(authenticateToken);

router.get('/', (req, res) => userController.getAll(req, res));
router.get('/:id', (req, res) => userController.getById(req, res));
router.patch('/:id', (req, res) => userController.update(req, res));
router.delete('/:id', (req, res) => userController.delete(req, res));

// Endpoints que no pueden ser usados por el usuario
router.post('/', function(req, res, next) {
    res.status(405).json({ error: 'Method not allowed' });
});

module.exports = router;
