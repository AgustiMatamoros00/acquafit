const exerciseService = require('../services/exercise_service');

class ExerciseController {
    async getAll(req, res) {
        try {
            const exercises = await exerciseService.getAllExercises();
            res.json({ message: 'Exercises retrieved successfully', exercises });
        } catch (error) {
            console.error('Get exercises error:', error);
            res.status(500).json({ error: 'Failed to retrieve exercises' });
        }
    }

    async getFavorites(req, res) {
        try {
            const exercises = await exerciseService.getFavorites(req.user.id);
            res.json({ message: 'Favorite exercises retrieved successfully', exercises });
        } catch (error) {
            console.error('Get favorite exercises error:', error);
            res.status(500).json({ error: 'Failed to retrieve favorite exercises' });
        }
    }

    async addFavorite(req, res) {
        try {
            await exerciseService.addFavorite(req.user.id, req.params.exerciseId);
            res.status(201).json({ message: 'Exercise added to favorites successfully' });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error('Add to favorites error:', error);
            res.status(500).json({ error: 'Failed to add exercise to favorites' });
        }
    }

    async removeFavorite(req, res) {
        try {
            await exerciseService.removeFavorite(req.user.id, req.params.exerciseId);
            res.json({ message: 'Exercise removed from favorites successfully' });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error('Remove from favorites error:', error);
            res.status(500).json({ error: 'Failed to remove exercise from favorites' });
        }
    }

    async getById(req, res) {
        try {
            const exercise = await exerciseService.getExerciseById(req.params.id, req.user.id);
            res.json({ message: 'Exercise retrieved successfully', exercise });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error('Get exercise error:', error);
            res.status(500).json({ error: 'Failed to retrieve exercise' });
        }
    }

    async getByMuscle(req, res) {
        try {
            const exercises = await exerciseService.getExercisesByMuscle(req.params.muscle);
            res.json({
                message: `Exercises for ${req.params.muscle} retrieved successfully`,
                muscle: req.params.muscle,
                exercises
            });
        } catch (error) {
            console.error('Get exercises by muscle error:', error);
            res.status(500).json({ error: 'Failed to retrieve exercises' });
        }
    }

    async create(req, res) {
        try {
            const { name, muscle, rest_time } = req.body;
            const exercise = await exerciseService.createExercise(name, muscle, rest_time, req.user);
            res.status(201).json({ message: 'Exercise created successfully', exercise });
        } catch (error) {
            if (error.status) {
                const response = { error: error.message };
                if (error.validMuscles) response.validMuscles = error.validMuscles;
                return res.status(error.status).json(response);
            }
            console.error('Create exercise error:', error);
            res.status(500).json({ error: 'Failed to create exercise' });
        }
    }

    async update(req, res) {
        try {
            const { name, muscle, rest_time } = req.body;
            const exercise = await exerciseService.updateExercise(req.params.id, name, muscle, rest_time, req.user);
            res.json({ message: 'Exercise updated successfully', exercise });
        } catch (error) {
            if (error.status) {
                const response = { error: error.message };
                if (error.validMuscles) response.validMuscles = error.validMuscles;
                return res.status(error.status).json(response);
            }
            console.error('Update exercise error:', error);
            res.status(500).json({ error: 'Failed to update exercise' });
        }
    }

    async delete(req, res) {
        try {
            await exerciseService.deleteExercise(req.params.id, req.user);
            res.json({ message: 'Exercise deleted successfully' });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error('Delete exercise error:', error);
            res.status(500).json({ error: 'Failed to delete exercise' });
        }
    }
}

module.exports = new ExerciseController();