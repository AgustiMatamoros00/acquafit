const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET - Obtener un workout_x_exercise específico
router.get('/:workoutExerciseId', async function(req, res) {
    try {
        const { workoutExerciseId } = req.params;

        // Verificar que el workout_x_exercise existe y pertenece al usuario
        const workoutExercise = await req.app.locals.db.oneOrNone(
            `SELECT 
                wxe.id as workout_exercise_id,
                wxe.exercise_at,
                w.id as workout_id,
                w.name as workout_name,
                w.day as workout_day,
                e.id as exercise_id,
                e.name as exercise_name,
                e.muscle as exercise_muscle,
                e.rest_time as exercise_rest_time
             FROM acquafit.workout_x_exercise wxe
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             INNER JOIN acquafit.exercise e ON wxe.fk_exercise = e.id
             WHERE wxe.id = $1`,
            [workoutExerciseId]
        );

        if (!workoutExercise) {
            return res.status(404).json({ error: 'Workout exercise not found' });
        }

        if (workoutExercise.fk_user !== req.user.id && !req.user.superadmin){
            return res.status(403).json({ 
                error: 'Only superadmins or the owner of the workout can access this resource',
                message: 'Access denied: You are not authorized to access this resource'
            });
        }

        res.json({
            message: 'Workout exercise retrieved successfully',
            workoutExercise: workoutExercise
        });
    } catch (error) {
        console.error('Get workout exercise error:', error);
        res.status(500).json({ error: 'Failed to retrieve workout exercise' });
    }
});

// POST - Añadir un ejercicio a un workout (IDs en el body)
router.post('/', async function(req, res) {
    try {
        const { workoutId, exerciseId } = req.body;

        // Validar campos requeridos
        if (!workoutId || !exerciseId) {
            return res.status(400).json({ error: 'workoutId and exerciseId are required' });
        }

        // Verificar que el workout pertenece al usuario
        const workout = await req.app.locals.db.oneOrNone(
            'SELECT id FROM acquafit.workout WHERE id = $1 AND fk_user = $2',
            [workoutId, req.user.id]
        );

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        // Verificar que el ejercicio existe
        const exercise = await req.app.locals.db.oneOrNone(
            'SELECT id, name FROM acquafit.exercise WHERE id = $1',
            [exerciseId]
        );

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        // Verificar que el ejercicio no esté ya en el workout
        const existingExercise = await req.app.locals.db.oneOrNone(
            'SELECT 1 FROM acquafit.workout_x_exercise WHERE fk_workout = $1 AND fk_exercise = $2',
            [workoutId, exerciseId]
        );

        if (existingExercise) {
            return res.status(400).json({ error: 'Exercise already exists in this workout' });
        }

        // Añadir ejercicio al workout
        const newWorkoutExercise = await req.app.locals.db.one(
            'INSERT INTO acquafit.workout_x_exercise (fk_workout, fk_exercise) VALUES ($1, $2) RETURNING *',
            [workoutId, exerciseId]
        );

        res.status(201).json({
            message: 'Exercise added to workout successfully',
            workoutExercise: newWorkoutExercise,
            exercise: exercise
        });
    } catch (error) {
        console.error('Add exercise to workout error:', error);
        res.status(500).json({ error: 'Failed to add exercise to workout' });
    }
});

// PATCH - Actualizar un workout_x_exercise específico
router.patch('/:workoutExerciseId', async function(req, res) {
    try {
        const { workoutExerciseId } = req.params;
        const { exercise_at } = req.body;

        // Verificar que el workout_x_exercise existe y pertenece al usuario
        const workoutExercise = await req.app.locals.db.oneOrNone(
            `SELECT wxe.* FROM acquafit.workout_x_exercise wxe
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE wxe.id = $1`,
            [workoutExerciseId]
        );

        if (!workoutExercise) {
            return res.status(404).json({ error: 'Workout exercise not found' });
        }

        if (workoutExercise.fk_user !== req.user.id && !req.user.superadmin){
            return res.status(403).json({ 
                error: 'Only superadmins or the owner of the workout can access this resource',
                message: 'Access denied: You are not authorized to access this resource'
            });
        }

        // Actualizar el workout_x_exercise
        const updatedWorkoutExercise = await req.app.locals.db.one(
            'UPDATE acquafit.workout_x_exercise SET exercise_at = COALESCE($1, exercise_at) WHERE id = $2 RETURNING *',
            [exercise_at, workoutExerciseId]
        );

        res.json({
            message: 'Workout exercise updated successfully',
            workoutExercise: updatedWorkoutExercise
        });
    } catch (error) {
        console.error('Update workout exercise error:', error);
        res.status(500).json({ error: 'Failed to update workout exercise' });
    }
});

// DELETE - Eliminar un workout_x_exercise específico
router.delete('/:workoutExerciseId', async function(req, res) {
    try {
        const { workoutExerciseId } = req.params;

        // Verificar que el workout_x_exercise existe y pertenece al usuario
        const workoutExercise = await req.app.locals.db.oneOrNone(
            `SELECT wxe.* FROM acquafit.workout_x_exercise wxe
             INNER JOIN acquafit.workout w ON wxe.fk_workout = w.id
             WHERE wxe.id = $1`,
            [workoutExerciseId]
        );

        if (!workoutExercise) {
            return res.status(404).json({ error: 'Workout exercise not found' });
        }

        if (workoutExercise.fk_user !== req.user.id && !req.user.superadmin){
            return res.status(403).json({ 
                error: 'Only superadmins or the owner of the workout can access this resource',
                message: 'Access denied: You are not authorized to access this resource'
            });
        }

        // Eliminar el workout_x_exercise (esto también eliminará los sets asociados por CASCADE)
        await req.app.locals.db.none(
            'DELETE FROM acquafit.workout_x_exercise WHERE id = $1',
            [workoutExerciseId]
        );

        res.json({
            message: 'Workout exercise deleted successfully'
        });
    } catch (error) {
        console.error('Delete workout exercise error:', error);
        res.status(500).json({ error: 'Failed to delete workout exercise' });
    }
});

module.exports = router;
