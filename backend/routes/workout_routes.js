const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const workoutController = require('../controllers/workout_controller');

// Aplicar middleware de autenticación a todas las rutas de workouts
router.use(authenticateToken);

router.get('/', (req, res) => workoutController.getAll(req, res));
router.post('/', (req, res) => workoutController.create(req, res));
router.get('/:id', (req, res) => workoutController.getById(req, res));
router.patch('/:id', (req, res) => workoutController.update(req, res));
router.delete('/:id', (req, res) => workoutController.delete(req, res));

module.exports = router;