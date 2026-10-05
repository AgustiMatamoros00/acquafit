const userService = require('../services/user_service');

class UserController {
    async getAll(req, res) {
        try {
            const users = await userService.getAllUsers(req.user);
            res.json({ users });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error('Get users error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id, req.user);
            res.json({ message: 'User retrieved successfully', user });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Get user error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req, res) {
        try {
            const { name, surname, weight_unit } = req.body;
            const user = await userService.updateUser(req.params.id, name, surname, weight_unit, req.user);
            res.json({ message: 'User updated successfully', user });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Update error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(req, res) {
        try {
            await userService.deleteUser(req.params.id, req.user);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message, message: error.message });
            }
            console.error('Delete error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new UserController();
