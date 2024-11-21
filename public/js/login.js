async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Enviar datos de login al servidor
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();

      // Validar que el token y el username existan en la respuesta
      if (data.token && data.username) {
        localStorage.setItem('token', data.token); // Guardar token
        localStorage.setItem('username', data.username); 
        console.log('Token almacenado:', data.token);
        console.log('Nombre de usuario almacenado:', data.username);

        // Redirigir al menú principal
        window.location.href = '/menu';
      } else {
        alert("Error: Datos incompletos recibidos del servidor.");
      }
    } else {
      // Manejar errores de autenticación
      const error = await response.json();
      alert('Error de login: ' + (error.error || 'Credenciales incorrectas.'));
    }
  } catch (error) {
    // Manejar errores de red u otros problemas
    console.error('Error en la conexión:', error);
    alert('Error: No se pudo conectar al servidor.');
  }
}
