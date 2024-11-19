// Espera a que el contenido de la página (HTML) haya sido completamente cargado y analizado.
document.addEventListener('DOMContentLoaded', () => {
  
    // Obtiene el formulario con el id 'postForm' (suponiendo que este formulario es para crear un nuevo post).
    const postForm = document.getElementById('postForm');
    
    // Si el formulario existe en la página (es decir, el elemento no es null), agrega un escuchador para el evento 'submit'.
    if (postForm) {
      // Cuando el formulario sea enviado, ejecutará la función 'createPost'.
      postForm.addEventListener('submit', createPost);
    }
  });
  
  // Función asincrónica que maneja la creación del post al enviar el formulario.
  async function createPost(event) {
    
    // Previene el comportamiento predeterminado del formulario, que es recargar la página al enviarse.
    event.preventDefault();
  
    // Intenta obtener el token de autenticación almacenado en el localStorage del navegador.
    const token = localStorage.getItem('token');
    
    // Si no hay token (lo que significa que el usuario no está autenticado), muestra una alerta.
    if (!token) {
      // Muestra un mensaje de alerta para indicar que el usuario debe iniciar sesión.
      alert("Por favor, inicia sesión para crear un post.");
      
      // Redirige al usuario a la página de login si no se encuentra un token en el almacenamiento local.
      window.location.href = '/login'; // Redirige al inicio de sesión si no hay token
      
      // Sale de la función, evitando que el formulario sea enviado sin token.
      return;
    }
  
    // Obtiene el valor de los campos del formulario: título, contenido y categoría del post.
    const id = document.getElementById('id').value;
    const tarea = document.getElementById('tarea').value;
    const usuario = document.getElementById('usuario').value;
    const area = document.getElementById('area').value;
    const estado = document.getElementById('estado').value;
    const prioridad = document.getElementById('prioridad').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
  
    // Realiza una solicitud HTTP al servidor para crear un nuevo post con los datos proporcionados en el formulario.
    const response = await fetch('/api/posts', {
      // El método de la solicitud será 'POST' para crear un nuevo recurso (el post).
      method: 'POST',
      
      // Los encabezados de la solicitud, donde indicamos el tipo de contenido (JSON) y la autorización con el token.
      headers: {
        'Content-Type': 'application/json', // Especifica que el cuerpo de la solicitud es JSON.
        'Authorization': `Bearer ${token}` // Añade el token de autorización en el encabezado para autenticar la solicitud.
      },
      
      // El cuerpo de la solicitud contiene los datos del nuevo post en formato JSON.
      body: JSON.stringify({ id, tarea, usuario, area, estado, prioridad, fechaVencimiento})
    });
  
    // Si la respuesta es exitosa (código de estado 200-299), procesamos la respuesta.
    if (response.ok) {
      // Se convierte la respuesta de la solicitud en un objeto JSON (que debe contener el post creado).
      const post = await response.json();
      
      // Muestra por consola el post creado para verificación o depuración.
      console.log('Post creado:', post);
      // Redirigir al usuario a la página de posts
      window.location.href = '/posts'; // Redirige a la página de posts
    } else {
      // Si la respuesta no fue exitosa (es decir, hubo algún error), obtiene el error de la respuesta.
      const errorData = await response.json();
      
      // Muestra el error en la consola para depuración.
      console.error('Error al crear el post:', errorData);
    }
  }
  