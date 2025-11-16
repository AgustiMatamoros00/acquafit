const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas de ejercicios
router.use(authenticateToken);

// Obtener todos los ejercicios (accesible para todos los usuarios autenticados)
router.get('/', async function(req, res) {
    try {
        const exercises = await req.app.locals.db.any(
            'SELECT * FROM acquafit.exercise ORDER BY name'
        );
        
        res.json({
            message: 'Exercises retrieved successfully',
            exercises: exercises
        });
    } catch (error) {
        console.error('Get exercises error:', error);
        res.status(500).json({ error: 'Failed to retrieve exercises' });
    }
});

// Obtener ejercicios favoritos del usuario
router.get('/favorites', async function(req, res) {
    try {
        const favoriteExercises = await req.app.locals.db.any(
            `SELECT e.*, ufe.created_at as favorited_at 
             FROM acquafit.exercise e 
             INNER JOIN acquafit.user_favorite_exercise ufe ON e.id = ufe.fk_exercise 
             WHERE ufe.fk_user = $1 
             ORDER BY ufe.created_at DESC`,
            [req.user.id]
        );
        
        res.json({
            message: 'Favorite exercises retrieved successfully',
            exercises: favoriteExercises
        });
    } catch (error) {
        console.error('Get favorite exercises error:', error);
        res.status(500).json({ error: 'Failed to retrieve favorite exercises' });
    }
});

// Añadir ejercicio a favoritos
router.post('/favorites/:exerciseId', async function(req, res) {
    try {
        const { exerciseId } = req.params;

        // Verificar que el ejercicio existe
        const exercise = await req.app.locals.db.oneOrNone(
            'SELECT id FROM acquafit.exercise WHERE id = $1',
            [exerciseId]
        );

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        // Añadir a favoritos (ignorar si ya existe con TRY-CATCH)
        try {
            await req.app.locals.db.none(
                'INSERT INTO acquafit.user_favorite_exercise (fk_user, fk_exercise) VALUES ($1, $2)',
                [req.user.id, exerciseId]
            );
        } catch (err) {
            // Ignorar error de constraint unique (ya existe)
        }

        res.status(201).json({
            message: 'Exercise added to favorites successfully'
        });
    } catch (error) {
        console.error('Add to favorites error:', error);
        res.status(500).json({ error: 'Failed to add exercise to favorites' });
    }
});

// Eliminar ejercicio de favoritos
router.delete('/favorites/:exerciseId', async function(req, res) {
    try {
        const { exerciseId } = req.params;

        const deleted = await req.app.locals.db.oneOrNone(
            'DELETE FROM acquafit.user_favorite_exercise OUTPUT DELETED.id WHERE fk_user = $1 AND fk_exercise = $2',
            [req.user.id, exerciseId]
        );

        if (!deleted) {
            return res.status(404).json({ error: 'Exercise not found in favorites' });
        }

        res.json({
            message: 'Exercise removed from favorites successfully'
        });
    } catch (error) {
        console.error('Remove from favorites error:', error);
        res.status(500).json({ error: 'Failed to remove exercise from favorites' });
    }
});

// Obtener un ejercicio específico
router.get('/:id', async function(req, res) {
    try {
        const { id } = req.params;
        
        const exercise = await req.app.locals.db.oneOrNone(
            'SELECT * FROM acquafit.exercise WHERE id = $1',
            [id]
        );

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        // Verificar si es favorito del usuario
        const isFavorite = await req.app.locals.db.oneOrNone(
            'SELECT 1 FROM acquafit.user_favorite_exercise WHERE fk_user = $1 AND fk_exercise = $2',
            [req.user.id, id]
        );

        res.json({
            message: 'Exercise retrieved successfully',
            exercise: {
                ...exercise,
                isFavorite: !!isFavorite
            }
        });
    } catch (error) {
        console.error('Get exercise error:', error);
        res.status(500).json({ error: 'Failed to retrieve exercise' });
    }
});

// Crear un nuevo ejercicio (solo superadmins)
router.post('/', async function(req, res) {
    try {
        // Verificar que el usuario es superadmin
        if (!req.user.superadmin) {
            return res.status(403).json({ 
                error: 'Only superadmins can create exercises',
                message: 'Access denied: You are not authorized to create exercises'
            });
        }

        const { name, muscle, rest_time } = req.body;

        // Validar campos requeridos
        if (!name || !muscle) {
            return res.status(400).json({ error: 'Name and muscle are required' });
        }

        // Verificar que el músculo es válido
        const validMuscles = [
            'Lats', 'Chest', 'Quadriceps', 'Biceps', 'Triceps', 
            'Trapezoids', 'Glutes', 'Abs', 'Hamstrings', 'Calves', 
            'Deltoids', 'Forearms', 'Rhomboids'
        ];

        if (!validMuscles.includes(muscle)) {
            return res.status(400).json({ 
                error: 'Invalid muscle type',
                validMuscles: validMuscles
            });
        }

        const newExercise = await req.app.locals.db.one(
            'INSERT INTO acquafit.exercise (name, muscle, rest_time) OUTPUT INSERTED.* VALUES ($1, $2, $3)',
            [name, muscle, rest_time || null]
        );

        res.status(201).json({
            message: 'Exercise created successfully',
            exercise: newExercise
        });
    } catch (error) {
        console.error('Create exercise error:', error);
        res.status(500).json({ error: 'Failed to create exercise' });
    }
});

// Actualizar un ejercicio (solo superadmins)
router.patch('/:id', async function(req, res) {
    try {
        // Verificar que el usuario es superadmin
        if (!req.user.superadmin) {
            return res.status(403).json({ 
                error: 'Only superadmins can update exercises',
                message: 'Access denied: You are not authorized to update exercises'
            });
        }

        const { id } = req.params;
        const { name, muscle, rest_time } = req.body;

        // Verificar que el músculo es válido si se proporciona
        if (muscle) {
            const validMuscles = [
                'Lats', 'Chest', 'Quadriceps', 'Biceps', 'Triceps', 
                'Trapezoids', 'Glutes', 'Abs', 'Hamstrings', 'Calves', 
                'Deltoids', 'Forearms', 'Rhomboids'
            ];

            if (!validMuscles.includes(muscle)) {
                return res.status(400).json({ 
                    error: 'Invalid muscle type',
                    validMuscles: validMuscles
                });
            }
        }

        const updatedExercise = await req.app.locals.db.oneOrNone(
            'UPDATE acquafit.exercise SET name = COALESCE($1, name), muscle = COALESCE($2, muscle), rest_time = COALESCE($3, rest_time) OUTPUT INSERTED.* WHERE id = $4',
            [name, muscle, rest_time, id]
        );

        if (!updatedExercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        res.json({
            message: 'Exercise updated successfully',
            exercise: updatedExercise
        });
    } catch (error) {
        console.error('Update exercise error:', error);
        res.status(500).json({ error: 'Failed to update exercise' });
    }
});

// Eliminar un ejercicio (solo superadmins)
router.delete('/:id', async function(req, res) {
    try {
        // Verificar que el usuario es superadmin
        if (!req.user.superadmin) {
            return res.status(403).json({ 
                error: 'Only superadmins can delete exercises',
                message: 'Access denied: You are not authorized to delete exercises'
            });
        }

        const { id } = req.params;

        // Verificar si el ejercicio está siendo usado en algún workout
        const exerciseInUse = await req.app.locals.db.oneOrNone(
            'SELECT TOP 1 1 FROM acquafit.workout_x_exercise WHERE fk_exercise = $1',
            [id]
        );

        if (exerciseInUse) {
            return res.status(400).json({ 
                error: 'Cannot delete exercise',
                message: 'This exercise is being used in workouts and cannot be deleted'
            });
        }

        const deletedExercise = await req.app.locals.db.oneOrNone(
            'DELETE FROM acquafit.exercise OUTPUT DELETED.id WHERE id = $1',
            [id]
        );

        if (!deletedExercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        res.json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        console.error('Delete exercise error:', error);
        res.status(500).json({ error: 'Failed to delete exercise' });
    }
});

// Obtener ejercicios por músculo
router.get('/muscle/:muscle', async function(req, res) {
    try {
        const { muscle } = req.params;
        
        const exercises = await req.app.locals.db.any(
            'SELECT * FROM acquafit.exercise WHERE muscle = $1 ORDER BY name',
            [muscle]
        );

        res.json({
            message: `Exercises for ${muscle} retrieved successfully`,
            muscle: muscle,
            exercises: exercises
        });
    } catch (error) {
        console.error('Get exercises by muscle error:', error);
        res.status(500).json({ error: 'Failed to retrieve exercises' });
    }
});

module.exports = router;

