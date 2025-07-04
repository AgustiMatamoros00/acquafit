const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas de workouts
router.use(authenticateToken);

// Obtener todos los workouts del usuario
router.get('/', async function(req, res) {
    try {
        const workouts = await req.app.locals.db.any(
            'SELECT * FROM acquafit.workout WHERE fk_user = $1 ORDER BY day DESC',
            [req.user.id]
        );
        
        res.json({
            message: 'Workouts retrieved successfully',
            workouts: workouts
        });
    } catch (error) {
        console.error('Get workouts error:', error);
        res.status(500).json({ error: 'Failed to retrieve workouts' });
    }
});

// Crear un nuevo workout
router.post('/', async function(req, res) {
    try {
        const { name } = req.body;
        
        const newWorkout = await req.app.locals.db.one(
            'INSERT INTO acquafit.workout (name, fk_user) VALUES ($1, $2) RETURNING *',
            [name, req.user.id]
        );
        
        res.status(201).json({
            message: 'Workout created successfully',
            workout: newWorkout
        });
    } catch (error) {
        console.error('Create workout error:', error);
        res.status(500).json({ error: 'Failed to create workout' });
    }
});

// Obtener un workout específico
router.get('/:id', async function(req, res) {
    try {
        const { id } = req.params;
        
        const workout = await req.app.locals.db.oneOrNone(
            'SELECT * FROM acquafit.workout WHERE id = $1 AND fk_user = $2',
            [id, req.user.id]
        );
        
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        
        res.json({
            message: 'Workout retrieved successfully',
            workout: workout
        });
    } catch (error) {
        console.error('Get workout error:', error);
        res.status(500).json({ error: 'Failed to retrieve workout' });
    }
});

// Actualizar un workout
router.patch('/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        const updatedWorkout = await req.app.locals.db.oneOrNone(
            'UPDATE acquafit.workout SET name = COALESCE($1, name) WHERE id = $2 AND fk_user = $3 RETURNING *',
            [name, id, req.user.id]
        );
        
        if (!updatedWorkout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        
        res.json({
            message: 'Workout updated successfully',
            workout: updatedWorkout
        });
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ error: 'Failed to update workout' });
    }
});

// Eliminar un workout
router.delete('/:id', async function(req, res) {
    try {
        const { id } = req.params;
        
        const deletedWorkout = await req.app.locals.db.oneOrNone(
            'DELETE FROM acquafit.workout WHERE id = $1 AND fk_user = $2 RETURNING id',
            [id, req.user.id]
        );
        
        if (!deletedWorkout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        
        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({ error: 'Failed to delete workout' });
    }
});

module.exports = router; 