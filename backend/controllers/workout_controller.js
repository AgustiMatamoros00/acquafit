const workoutService = require('../services/workout_service');

class WorkoutController {
    async getAll(req, res) {
        try {
            const workouts = await workoutService.getAllWorkouts(req.user.id);
            
            res.json({
                message: 'Workouts retrieved successfully',
                workouts: workouts
            });
        } catch (error) {
            console.error('Get workouts error:', error);
            res.status(500).json({ error: 'Failed to retrieve workouts' });
        }
    }

    async create(req, res) {
        try {
            const { name } = req.body;
            const newWorkout = await workoutService.createWorkout(name, req.user.id);
            
            res.status(201).json({
                message: 'Workout created successfully',
                workout: newWorkout
            });
        } catch (error) {
            console.error('Create workout error:', error);
            res.status(500).json({ error: 'Failed to create workout' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const workout = await workoutService.getWorkoutById(id, req.user);
            
            res.json({
                message: 'Workout retrieved successfully',
                workout: workout
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.error || error.message, message: error.message });
            }
            console.error('Get workout error:', error);
            res.status(500).json({ error: 'Failed to retrieve workout' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            
            const updatedWorkout = await workoutService.updateWorkout(id, name, req.user);
            
            res.json({
                message: 'Workout updated successfully',
                workout: updatedWorkout
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.error || error.message, message: error.message });
            }
            console.error('Update workout error:', error);
            res.status(500).json({ error: 'Failed to update workout' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await workoutService.deleteWorkout(id, req.user);
            
            res.json({ message: 'Workout deleted successfully' });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.error || error.message, message: error.message });
            }
            console.error('Delete workout error:', error);
            res.status(500).json({ error: 'Failed to delete workout' });
        }
    }
}

module.exports = new WorkoutController();
