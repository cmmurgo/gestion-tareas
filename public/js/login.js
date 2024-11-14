async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (response.ok) {
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token); // Almacena el token
      console.log('Token almacenado:', localStorage.getItem('token'));
      window.location.href = '/posts'; // Redirige a la página de posts
    } else {
      alert("Error: Token no recibido.");
    }
  } else {
    const error = await response.json();
    alert('Error de login: ' + error.error);
  }
}
