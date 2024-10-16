const usuarios = [
    { username: 'admin', password: 'admin' }
];

exports.iniciarSesion = (req, res) => {
    const { username, password } = req.body;
    const usuario = usuarios.find(u => u.username === username && u.password === password);

    if (!usuario) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    req.session.usuario = usuario;
    res.json({ mensaje: 'Inicio de sesión exitoso' });
};

exports.cerrarSesion = (req, res) => {
    req.session.destroy();
    res.json({ mensaje: 'Sesión cerrada' });
};
