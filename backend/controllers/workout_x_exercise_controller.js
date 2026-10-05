const wxeService = require('../services/workout_x_exercise_service');

class WorkoutXExerciseController {
    async getById(req, res) {
        try {
            const wxe = await wxeService.getById(req.params.workoutExerciseId, req.user);
            res.json({ message: 'Workout exercise retrieved successfully', workoutExercise: wxe });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Get workout exercise error:', error);
            res.status(500).json({ error: 'Failed to retrieve workout exercise' });
        }
    }

    async create(req, res) {
        try {
            const { workoutId, exerciseId } = req.body;
            const result = await wxeService.create(workoutId, exerciseId, req.user);
            res.status(201).json({
                message: 'Exercise added to workout successfully',
                workoutExercise: result.workoutExercise,
                exercise: result.exercise
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Add exercise to workout error:', error);
            res.status(500).json({ error: 'Failed to add exercise to workout' });
        }
    }

    async update(req, res) {
        try {
            const { exercise_at } = req.body;
            const wxe = await wxeService.update(req.params.workoutExerciseId, exercise_at, req.user);
            res.json({ message: 'Workout exercise updated successfully', workoutExercise: wxe });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Update workout exercise error:', error);
            res.status(500).json({ error: 'Failed to update workout exercise' });
        }
    }

    async delete(req, res) {
        try {
            await wxeService.delete(req.params.workoutExerciseId, req.user);
            res.json({ message: 'Workout exercise deleted successfully' });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Delete workout exercise error:', error);
            res.status(500).json({ error: 'Failed to delete workout exercise' });
        }
    }
}

module.exports = new WorkoutXExerciseController();
