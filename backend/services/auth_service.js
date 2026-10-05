const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user_repository');
const config = require('../config');

class AuthService {
    async login(email, password) {
        if (!email || !password) {
            throw { status: 400, message: 'Email and password are required' };
        }

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        return {
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                weight_unit: user.weight_unit,
                superadmin: user.superadmin
            }
        };
    }

    async register(email, password, name, surname) {
        if (!email || !password || !name || !surname) {
            throw { status: 400, message: 'Email, password, name and surname are required' };
        }

        const existingUser = await userRepository.findIdByEmail(email);
        if (existingUser) {
            throw { status: 400, message: 'Email already registered' };
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        await userRepository.create(email, hashedPassword, name, surname);
    }
}

module.exports = new AuthService();
