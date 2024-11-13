// Controlador para renderizar la página de inicio
exports.getHome = (req, res) => {
  res.render('index');
};

// Controlador para renderizar la página de inicio de sesión
exports.getLogin = (req, res) => {
  // Renderiza la vista 'login' sin pasar ningún dato adicional
  res.render('login');
};

// Controlador para renderizar la página de registro
exports.getRegister = (req, res) => {
  // Renderiza la vista 'register' sin pasar ningún dato adicional
  res.render('register');
};
