const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/auth_controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Ruta para validar token
router.get('/validate', authenticateToken, function(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7);
        
        res.json({ 
            valid: true, 
            user: {
                userId: req.user.id,
                email: req.user.email,
                name: req.user.name,
                surname: req.user.surname,
                weight_unit: req.user.weight_unit,
                superadmin: req.user.superadmin
            }
        });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

router.patch('/:id', async function(req, res) { res.status(405).json({ error: 'Method not allowed' }); });
router.delete('/:id', async function(req, res) { res.status(405).json({ error: 'Method not allowed' }); });
router.post('/', async function(req, res) { res.status(405).json({ error: 'Method not allowed' }); });

module.exports = router;