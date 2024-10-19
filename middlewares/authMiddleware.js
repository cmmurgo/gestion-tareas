// Middleware para verificar si el usuario está autenticado
exports.requireAuth = (req, res, next) => {
    if (!req.session.usuario) { 
        return res.redirect('/login'); 
    }
    next();
};
