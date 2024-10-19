const usuarioValido = { username: 'admin', password: '1234' };

// Maneja la lógica del login
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Verificar si las credenciales son correctas
    if (username === usuarioValido.username && password === usuarioValido.password) {
        req.session.usuario = { username }; // Guardar usuario en sesión
        res.redirect('/'); // Redirigir al panel
    } else {
        res.redirect('/login?error=Credenciales incorrectas'); // Mostrar error en login
    }
};

// Renderiza el formulario de login
exports.renderLoginForm = (req, res) => {
    const error = req.query.error || null; // Capturar error si existe
    res.render('login', { error });
};

// Maneja la lógica de logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirigir al login después de cerrar sesión
    });
};
