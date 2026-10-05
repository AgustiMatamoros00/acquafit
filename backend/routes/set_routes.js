const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const setController = require('../controllers/set_controller');

// Aplicar middleware de autenticación a todas las rutas de sets
router.use(authenticateToken);

router.post('/', (req, res) => setController.create(req, res));
router.get('/:setId', (req, res) => setController.getById(req, res));
router.patch('/:setId', (req, res) => setController.update(req, res));
router.delete('/:setId', (req, res) => setController.delete(req, res));

module.exports = router;