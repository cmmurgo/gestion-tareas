const usuarioValido = { username: 'admin', password: '1234' };

// Renderiza el formulario de login
exports.renderLoginForm = (req, res) => {
    const error = req.query.error || null; 
    res.render('login', { error });
};

// Maneja la lógica del login
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Verificar si las credenciales son correctas
    if (username === usuarioValido.username && password === usuarioValido.password) {
        req.session.usuario = { username }; 
        res.redirect('/'); 
    } else {
        res.redirect('/login?error=Credenciales incorrectas'); 
    }
};

// Maneja la lógica de logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); 
    });
};
