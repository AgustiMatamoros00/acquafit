const wxeRepository = require('../repositories/workout_x_exercise_repository');

class WorkoutXExerciseService {
    async getById(workoutExerciseId, user) {
        const wxe = await wxeRepository.findByIdWithDetails(workoutExerciseId);
        if (!wxe) {
            throw { status: 404, message: 'Workout exercise not found' };
        }
        if (wxe.fk_user !== user.id && !user.superadmin) {
            throw { status: 403, message: 'Access denied: You are not authorized to access this resource' };
        }
        return wxe;
    }

    async create(workoutId, exerciseId, user) {
        if (!workoutId || !exerciseId) {
            throw { status: 400, message: 'workoutId and exerciseId are required' };
        }

        const workout = await wxeRepository.findWorkoutByIdAndUser(workoutId, user.id);
        if (!workout) {
            throw { status: 404, message: 'Workout not found' };
        }

        const exercise = await wxeRepository.findExerciseById(exerciseId);
        if (!exercise) {
            throw { status: 404, message: 'Exercise not found' };
        }

        const existing = await wxeRepository.findExisting(workoutId, exerciseId);
        if (existing) {
            throw { status: 400, message: 'Exercise already exists in this workout' };
        }

        const newWxe = await wxeRepository.create(workoutId, exerciseId);
        return { workoutExercise: newWxe, exercise };
    }

    async update(workoutExerciseId, exerciseAt, user) {
        const wxe = await wxeRepository.findByIdWithOwner(workoutExerciseId);
        if (!wxe) {
            throw { status: 404, message: 'Workout exercise not found' };
        }
        if (wxe.fk_user !== user.id && !user.superadmin) {
            throw { status: 403, message: 'Access denied: You are not authorized to access this resource' };
        }

        return await wxeRepository.update(workoutExerciseId, exerciseAt);
    }

    async delete(workoutExerciseId, user) {
        const wxe = await wxeRepository.findByIdWithOwner(workoutExerciseId);
        if (!wxe) {
            throw { status: 404, message: 'Workout exercise not found' };
        }
        if (wxe.fk_user !== user.id && !user.superadmin) {
            throw { status: 403, message: 'Access denied: You are not authorized to access this resource' };
        }

        await wxeRepository.delete(workoutExerciseId);
    }
}

module.exports = new WorkoutXExerciseService();
