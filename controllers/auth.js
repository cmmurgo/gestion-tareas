// controllers/auth.js

const login = (req, res) => {
    const { username, password } = req.body;
    const usuario = { username: 'admin', password: 'admin' }; // Simulación, reemplaza con DB

    if (username === usuario.username && password === usuario.password) {
        req.session.usuario = usuario; // Guardar usuario en sesión
        res.redirect('/'); // Redirigir al panel si las credenciales son correctas
    } else {
        res.redirect('/login?error=Credenciales incorrectas'); // Redirige al login con error
    }
};

module.exports = { login };
