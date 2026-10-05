const exerciseRepository = require('../repositories/exercise_repository');

const VALID_MUSCLES = [
    'Lats', 'Pectorals', 'Quadriceps', 'Biceps', 'Triceps', 
    'Trapezius', 'Glutes', 'Abs', 'Hamstrings', 'Calves', 
    'Deltoids', 'Forearms', 'Rhomboids'
];

class ExerciseService {
    async getAllExercises() {
        return await exerciseRepository.findAll();
    }

    async getExerciseById(id, userId) {
        const exercise = await exerciseRepository.findById(id);
        if (!exercise) {
            throw { status: 404, message: 'Exercise not found' };
        }

        const isFavorite = await exerciseRepository.isFavorite(userId, id);
        return { ...exercise, isFavorite: !!isFavorite };
    }

    async getExercisesByMuscle(muscle) {
        return await exerciseRepository.findByMuscle(muscle);
    }

    async createExercise(name, muscle, restTime, user) {
        if (!user.superadmin) {
            throw { status: 403, message: 'Only superadmins can create exercises' };
        }
        if (!name || !muscle) {
            throw { status: 400, message: 'Name and muscle are required' };
        }
        if (!VALID_MUSCLES.includes(muscle)) {
            throw { status: 400, message: 'Invalid muscle type', validMuscles: VALID_MUSCLES };
        }

        return await exerciseRepository.create(name, muscle, restTime);
    }

    async updateExercise(id, name, muscle, restTime, user) {
        if (!user.superadmin) {
            throw { status: 403, message: 'Only superadmins can update exercises' };
        }
        if (muscle && !VALID_MUSCLES.includes(muscle)) {
            throw { status: 400, message: 'Invalid muscle type', validMuscles: VALID_MUSCLES };
        }

        const updated = await exerciseRepository.update(id, name, muscle, restTime);
        if (!updated) {
            throw { status: 404, message: 'Exercise not found' };
        }
        return updated;
    }

    async deleteExercise(id, user) {
        if (!user.superadmin) {
            throw { status: 403, message: 'Only superadmins can delete exercises' };
        }

        const inUse = await exerciseRepository.isInUseByWorkout(id);
        if (inUse) {
            throw { status: 400, message: 'This exercise is being used in workouts and cannot be deleted' };
        }

        const deleted = await exerciseRepository.delete(id);
        if (!deleted) {
            throw { status: 404, message: 'Exercise not found' };
        }
    }

    // Favoritos
    async getFavorites(userId) {
        return await exerciseRepository.findFavoritesByUser(userId);
    }

    async addFavorite(userId, exerciseId) {
        const exercise = await exerciseRepository.findById(exerciseId);
        if (!exercise) {
            throw { status: 404, message: 'Exercise not found' };
        }
        await exerciseRepository.addFavorite(userId, exerciseId);
    }

    async removeFavorite(userId, exerciseId) {
        const deleted = await exerciseRepository.removeFavorite(userId, exerciseId);
        if (!deleted) {
            throw { status: 404, message: 'Exercise not found in favorites' };
        }
    }
}

module.exports = new ExerciseService();