const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const exerciseController = require('../controllers/exercise_controller');

// Aplicar middleware de autenticación a todas las rutas de ejercicios
router.use(authenticateToken);

// Favoritos (antes de /:id para evitar conflicto de rutas)
router.get('/favorites', (req, res) => exerciseController.getFavorites(req, res));
router.post('/favorites/:exerciseId', (req, res) => exerciseController.addFavorite(req, res));
router.delete('/favorites/:exerciseId', (req, res) => exerciseController.removeFavorite(req, res));

// Por músculo (antes de /:id para evitar conflicto de rutas)
router.get('/muscle/:muscle', (req, res) => exerciseController.getByMuscle(req, res));

// CRUD
router.get('/', (req, res) => exerciseController.getAll(req, res));
router.post('/', (req, res) => exerciseController.create(req, res));
router.get('/:id', (req, res) => exerciseController.getById(req, res));
router.patch('/:id', (req, res) => exerciseController.update(req, res));
router.delete('/:id', (req, res) => exerciseController.delete(req, res));

module.exports = router;