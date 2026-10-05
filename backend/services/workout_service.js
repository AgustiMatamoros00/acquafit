const workoutRepository = require('../repositories/workout_repository');

class WorkoutService {
    async getAllWorkouts(userId) {
        return await workoutRepository.findAllByUser(userId);
    }

    async createWorkout(name, userId) {
        return await workoutRepository.create(name, userId);
    }

    async getWorkoutById(id, user) {
        const workout = await workoutRepository.findById(id);

        if (!workout) {
            throw { status: 404, message: 'Workout not found' };
        }

        if (workout.fk_user !== user.id && !user.superadmin) {
            throw { 
                status: 403, 
                message: 'Access denied: You are not authorized to access this resource', 
                error: 'Only superadmins or the owner of the workout can access this resource' 
            };
        }

        return workout;
    }

    async updateWorkout(id, name, user) {
        await this.getWorkoutById(id, user); // Validar
        return await workoutRepository.updateName(id, name);
    }

    async deleteWorkout(id, user) {
        await this.getWorkoutById(id, user); // Validar
        await workoutRepository.delete(id);
    }
}

module.exports = new WorkoutService();
