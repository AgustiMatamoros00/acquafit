const userRepository = require('../repositories/user_repository');

class UserService {
    async getAllUsers(user) {
        if (!user.superadmin) {
            throw { status: 403, message: 'You are not allowed to access this endpoint' };
        }
        return await userRepository.findAll();
    }

    async getUserById(id, user) {
        if (id !== user.id.toString() && !user.superadmin) {
            throw { status: 403, message: "Access denied: You are not authorized to view this user's information" };
        }

        const foundUser = await userRepository.findPublicById(id);
        if (!foundUser) {
            throw { status: 404, message: 'User not found' };
        }
        return foundUser;
    }

    async updateUser(id, name, surname, weightUnit, user) {
        if (id !== user.id.toString()) {
            throw { status: 403, message: "Access denied: You are not authorized to update this user's information" };
        }

        return await userRepository.update(id, name, surname, weightUnit);
    }

    async deleteUser(id, user) {
        if (id !== user.id.toString() && !user.superadmin) {
            throw { status: 403, message: "Access denied: You are not authorized to delete this user's account" };
        }

        await userRepository.delete(id);
    }
}

module.exports = new UserService();
