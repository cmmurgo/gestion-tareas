// Espera a que el contenido de la página (HTML) haya sido completamente cargado y analizado.
document.addEventListener('DOMContentLoaded', () => {
  
    // Obtiene el formulario con el id 'postForm' (suponiendo que este formulario es para crear un nuevo post).
    const postForm = document.getElementById('postForm');
    
    // Si el formulario existe en la página (es decir, el elemento no es null), agrega un escuchador para el evento 'submit'.
    if (postForm) {
      // Cuando el formulario sea enviado, ejecutará la función 'createTarea'.
      postForm.addEventListener('submit', createTarea);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const obtenerUltimoId = async () => {
        try {
            const response = await fetch('/api/ultimo-id');
            if (!response.ok) throw new Error('Error al obtener el último ID');
            const data = await response.json();
            const idInput = document.getElementById('id');
            if (idInput) {      
                idInput.value = data.ultimoId; 
            } 
        } catch (error) {
            console.error(error);
        }
    };

    obtenerUltimoId(); 
});
  

  async function createTarea(event) {
    
    // Previene el comportamiento predeterminado del formulario, que es recargar la página al enviarse.
    event.preventDefault();
  
    // Intenta obtener el token de autenticación almacenado en el localStorage del navegador.
    const token = localStorage.getItem('token');
    
    // Si no hay token (lo que significa que el usuario no está autenticado), muestra una alerta.
    if (!token) {
      // Muestra un mensaje de alerta para indicar que el usuario debe iniciar sesión.
      alert("Por favor, inicia sesión para crear una tarea.");
      
      window.location.href = '/login'; 
      
      // Sale de la función, evitando que el formulario sea enviado sin token.
      return;
    }
  
    const id = document.getElementById('id').value;
    const tarea = document.getElementById('tarea').value;
    const usuario = document.getElementById('usuario').value;
    const area = document.getElementById('area').value;
    const estado = document.getElementById('estado').value;
    const prioridad = document.getElementById('prioridad').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
  
    // Realiza una solicitud HTTP al servidor para crear una nueva tarea con los datos proporcionados en el formulario.
    const response = await fetch('/api/menu', {
      // El método de la solicitud será 'POST' para crear un nuevo recurso (el post).
      method: 'POST',
      
      // Los encabezados de la solicitud, donde indicamos el tipo de contenido (JSON) y la autorización con el token.
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` // Añade el token de autorización en el encabezado para autenticar la solicitud.
      },
      
      // El cuerpo de la solicitud contiene los datos del nuevo post en formato JSON.
      body: JSON.stringify({ id, tarea, usuario, area, estado, prioridad, fechaVencimiento})
    });
  
    // Si la respuesta es exitosa (código de estado 200-299), procesamos la respuesta.
    if (response.ok) {

      const tarea = await response.json();      
    
      console.log('Post creado:', tarea);
      window.location.href = '/menu'; 
    } else {
      // Si la respuesta no fue exitosa (es decir, hubo algún error), obtiene el error de la respuesta.
      const errorData = await response.json();
      
      // Muestra el error en la consola para depuración.
      console.error('Error al crear la tarea:', errorData);
    }
  }



  