const authService = require('../services/auth_service');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            
            res.json({ 
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async register(req, res) {
        try {
            const { email, password, name, surname } = req.body;
            await authService.register(email, password, name, surname);

            res.status(201).json({
                message: 'User registered successfully'
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new AuthController();
