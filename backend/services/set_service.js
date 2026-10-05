const setRepository = require('../repositories/set_repository');

class SetService {
    async getSetById(setId, user) {
        const set = await setRepository.findByIdWithDetails(setId);
        if (!set) {
            throw { status: 404, message: 'Set not found' };
        }
        if (set.fk_user !== user.id && !user.superadmin) {
            throw { status: 403, message: 'Access denied: You are not authorized to access this resource' };
        }
        return set;
    }

    async createSet(workoutExerciseId, weight, repetitions, rir, user) {
        if (!workoutExerciseId || !weight || !repetitions) {
            throw { status: 400, message: 'workoutExerciseId, weight, and repetitions are required' };
        }

        const workoutExercise = await setRepository.findWorkoutExerciseWithOwner(workoutExerciseId);
        if (!workoutExercise) {
            throw { status: 404, message: 'Workout exercise not found' };
        }
        if (workoutExercise.fk_user !== user.id && !user.superadmin) {
            throw { status: 403, message: 'Access denied: You are not authorized to create sets for this exercise' };
        }

        return await setRepository.create(weight, repetitions, rir, workoutExerciseId);
    }

    async updateSet(setId, weight, repetitions, rir, user) {
        const set = await setRepository.findByIdWithOwner(setId);
        if (!set) {
            throw { status: 404, message: 'Set not found' };
        }
        if (set.fk_user !== user.id && !user.superadmin) {
            throw { status: 403, message: 'Access denied: You are not authorized to access this resource' };
        }

        return await setRepository.update(setId, weight, repetitions, rir);
    }

    async deleteSet(setId, user) {
        const set = await setRepository.findByIdWithOwner(setId);
        if (!set) {
            throw { status: 404, message: 'Set not found' };
        }
        if (set.fk_user !== user.id && !user.superadmin) {
            throw { status: 403, message: 'Access denied: You are not authorized to access this resource' };
        }

        await setRepository.delete(setId);
    }
}

module.exports = new SetService();
