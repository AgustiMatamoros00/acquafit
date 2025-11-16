const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas de sets
router.use(authenticateToken);

// GET - Obtener un set específico
router.get('/:setId', async function(req, res) {
    try {
        const { setId } = req.params;

        // Obtener el set con información completa
        const set = await req.app.locals.db.oneOrNone(
            `SELECT 
                s.*,
                e.name as exercise_name,
                e.muscle as exercise_muscle,
                wxe.id as workout_exercise_id,
                wxe.exercise_at,
                w.id as workout_id,
                w.name as workout_name,
                w.fk_user
             FROM acquafit.[set] s
             INNER JOIN acquafit.workout_x_exercise wxe ON s.fk_workout_x_exercise = wxe.id
             INNER JOIN acquafit.exercise e ON wxe.fk_exercise = e.id
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE s.id = $1`,
            [setId]
        );

        if (!set) {
            return res.status(404).json({ error: 'Set not found' });
        }

        if (set.fk_user !== req.user.id && !req.user.superadmin) {
            return res.status(403).json({ 
                error: 'Only superadmins or the owner of the workout can access this resource',
                message: 'Access denied: You are not authorized to access this resource'
            });
        }

        res.json({
            message: 'Set retrieved successfully',
            set: set
        });
    } catch (error) {
        console.error('Get set error:', error);
        res.status(500).json({ error: 'Failed to retrieve set' });
    }
});

// POST - Crear un nuevo set
router.post('/', async function(req, res) {
    try {
        const { workoutExerciseId, weight, repetitions, rir } = req.body;

        // Validar campos requeridos
        if (!workoutExerciseId || !weight || !repetitions) {
            return res.status(400).json({ error: 'workoutExerciseId, weight, and repetitions are required' });
        }

        // Verificar que el workout_x_exercise existe y pertenece al usuario
        const workoutExercise = await req.app.locals.db.oneOrNone(
            `SELECT wxe.*, w.fk_user 
             FROM acquafit.workout_x_exercise wxe
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE wxe.id = $1`,
            [workoutExerciseId]
        );

        if (!workoutExercise) {
            return res.status(404).json({ error: 'Workout exercise not found' });
        }

        if (workoutExercise.fk_user !== req.user.id && !req.user.superadmin) {
            return res.status(403).json({ 
                error: 'Only superadmins or the owner of the workout can create sets for this exercise',
                message: 'Access denied: You are not authorized to create sets for this exercise'
            });
        }

        // Crear el set
        const newSet = await req.app.locals.db.one(
            'INSERT INTO acquafit.[set] (weight, repetitions, rir, fk_workout_x_exercise) OUTPUT INSERTED.* VALUES ($1, $2, $3, $4)',
            [weight, repetitions, rir || null, workoutExerciseId]
        );

        res.status(201).json({
            message: 'Set created successfully',
            set: newSet
        });
    } catch (error) {
        console.error('Create set error:', error);
        res.status(500).json({ error: 'Failed to create set' });
    }
});

// PATCH - Actualizar un set específico
router.patch('/:setId', async function(req, res) {
    try {
        const { setId } = req.params;
        const { weight, repetitions, rir } = req.body;

        // Verificar que el set existe y pertenece al usuario
        const set = await req.app.locals.db.oneOrNone(
            `SELECT s.*, w.fk_user FROM acquafit.[set] s
             INNER JOIN acquafit.workout_x_exercise wxe ON s.fk_workout_x_exercise = wxe.id
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE s.id = $1`,
            [setId]
        );

        if (!set) {
            return res.status(404).json({ error: 'Set not found' });
        }

        if (set.fk_user !== req.user.id && !req.user.superadmin) {
            return res.status(403).json({ 
                error: 'Only superadmins or the owner of the workout can access this resource',
                message: 'Access denied: You are not authorized to access this resource'
            });
        }

        // Actualizar el set
        const updatedSet = await req.app.locals.db.one(
            'UPDATE acquafit.[set] SET weight = COALESCE($1, weight), repetitions = COALESCE($2, repetitions), rir = COALESCE($3, rir) OUTPUT INSERTED.* WHERE id = $4',
            [weight, repetitions, rir, setId]
        );

        res.json({
            message: 'Set updated successfully',
            set: updatedSet
        });
    } catch (error) {
        console.error('Update set error:', error);
        res.status(500).json({ error: 'Failed to update set' });
    }
});

// DELETE - Eliminar un set específico
router.delete('/:setId', async function(req, res) {
    try {
        const { setId } = req.params;

        // Verificar que el set existe y pertenece al usuario
        const set = await req.app.locals.db.oneOrNone(
            `SELECT s.*, w.fk_user FROM acquafit.[set] s
             INNER JOIN acquafit.workout_x_exercise wxe ON s.fk_workout_x_exercise = wxe.id
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE s.id = $1`,
            [setId]
        );

        if (!set) {
            return res.status(404).json({ error: 'Set not found' });
        }

        if (set.fk_user !== req.user.id && !req.user.superadmin) {
            return res.status(403).json({ 
                error: 'Only superadmins or the owner of the workout can access this resource',
                message: 'Access denied: You are not authorized to access this resource'
            });
        }

        // Eliminar el set
        await req.app.locals.db.none(
            'DELETE FROM acquafit.[set] WHERE id = $1',
            [setId]
        );

        res.json({
            message: 'Set deleted successfully'
        });
    } catch (error) {
        console.error('Delete set error:', error);
        res.status(500).json({ error: 'Failed to delete set' });
    }
});

module.exports = router;

