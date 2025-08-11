var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

// Clave secreta para firmar JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Ruta para validar token
router.get('/validate', authenticateToken, function(req, res) {
    try {
        res.json({ 
            valid: true, 
            user: {
                id: req.user.id,
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

// Ruta de login
router.post('/login', async function(req, res) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Buscar usuario en la base de datos
        const user = await req.app.locals.db.oneOrNone(
            'SELECT * FROM acquafit."user" WHERE email = $1',
            [email]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verificar la contraseña
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generar JWT
        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                weight_unit: user.weight_unit,
                superadmin: user.superadmin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Ruta de registro
router.post('/register', async function(req, res) {
    try {
        const { email, password, name, surname } = req.body;

        // Validar campos requeridos
        if (!email || !password || !name || !surname) {
            return res.status(400).json({ error: 'Email, password, name and surname are required' });
        }

        // Verificar si el email ya existe
        const existingUser = await req.app.locals.db.oneOrNone(
            'SELECT id FROM acquafit."user" WHERE email = $1',
            [email]
        );

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = bcrypt.hashSync(password, 10);
        await req.app.locals.db.one(
            'INSERT INTO acquafit."user" (email, password, name, surname, weight_unit) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, surname',
            [email, hashedPassword, name, surname, 'kg']
        );

        res.status(201).json({
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Endpoints que no pueden ser usados por el usuario
router.patch('/:id', async function(req, res) {
    res.status(405).json({ error: 'Method not allowed' });
});

router.delete('/:id', async function(req, res) {
    res.status(405).json({ error: 'Method not allowed' });
});

router.post('/', async function(req, res) {
    res.status(405).json({ error: 'Method not allowed' });
});

router.get('/', async function(req, res) {
    res.status(405).json({ error: 'Method not allowed' });
});


module.exports = router;