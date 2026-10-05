const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepository = require('../repositories/user_repository');

// Middleware de autenticación
const authenticateToken = async function(req, res, next) {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header required' });
        }

        const token = authHeader.substring(7); // Remover 'Bearer ' del token

        // Verificar y decodificar el JWT
        const decoded = jwt.verify(token, config.jwt.secret);
        
        // Obtener datos actualizados del usuario desde la base de datos
        const user = await userRepository.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Añadir el usuario al request para que esté disponible en las rutas
        req.user = user;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            console.error('Authentication error:', error);
            res.status(500).json({ error: 'Authentication failed' });
        }
    }
};

module.exports = {
    authenticateToken
}; 