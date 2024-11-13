const express = require('express');
const router = express.Router();
const { login, logout, renderLoginForm } = require('../controllers/viewsController');
const { requireAuth } = require('../middlewares/middleware');

// Ruta para el formulario de login
router.get('/login', renderLoginForm);

// Ruta para manejar el inicio de sesión (POST)
router.post('/login', login);

// Ruta para el panel principal, protegida con autenticación
router.get('/', requireAuth, (req, res) => {
    res.render('index', { usuario: req.session.usuario });
});

// Ruta para cerrar sesión
router.get('/logout', logout);

module.exports = router;
