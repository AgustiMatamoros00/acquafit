const setService = require('../services/set_service');

class SetController {
    async getById(req, res) {
        try {
            const set = await setService.getSetById(req.params.setId, req.user);
            res.json({ message: 'Set retrieved successfully', set });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Get set error:', error);
            res.status(500).json({ error: 'Failed to retrieve set' });
        }
    }

    async create(req, res) {
        try {
            const { workoutExerciseId, weight, repetitions, rir } = req.body;
            const set = await setService.createSet(workoutExerciseId, weight, repetitions, rir, req.user);
            res.status(201).json({ message: 'Set created successfully', set });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Create set error:', error);
            res.status(500).json({ error: 'Failed to create set' });
        }
    }

    async update(req, res) {
        try {
            const { weight, repetitions, rir } = req.body;
            const set = await setService.updateSet(req.params.setId, weight, repetitions, rir, req.user);
            res.json({ message: 'Set updated successfully', set });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Update set error:', error);
            res.status(500).json({ error: 'Failed to update set' });
        }
    }

    async delete(req, res) {
        try {
            await setService.deleteSet(req.params.setId, req.user);
            res.json({ message: 'Set deleted successfully' });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Delete set error:', error);
            res.status(500).json({ error: 'Failed to delete set' });
        }
    }
}

module.exports = new SetController();
