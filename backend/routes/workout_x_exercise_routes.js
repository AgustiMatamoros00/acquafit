const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const wxeController = require('../controllers/workout_x_exercise_controller');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

router.post('/', (req, res) => wxeController.create(req, res));
router.get('/:workoutExerciseId', (req, res) => wxeController.getById(req, res));
router.patch('/:workoutExerciseId', (req, res) => wxeController.update(req, res));
router.delete('/:workoutExerciseId', (req, res) => wxeController.delete(req, res));

module.exports = router;
