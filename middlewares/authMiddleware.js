// Middleware para verificar si el usuario está autenticado
exports.requireAuth = (req, res, next) => {
    if (!req.session.usuario) { // Verificar si el usuario está en sesión
        return res.redirect('/login'); // Redirige al login si no está autenticado
    }
    next(); // Continúa si está autenticado
};
