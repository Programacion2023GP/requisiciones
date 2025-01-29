import Swal from 'sweetalert2';

type ToastIcon = 'success' | 'error' | 'warning' | 'info' | 'question'; // Definir el tipo para icon

// Función para mostrar un toast con un mensaje específico
export const showToast = (message: string, icon: ToastIcon = 'success') => {
  Swal.fire({
    toast: true,            // Habilita el modo toast
    position: 'top-end',    // Posición en la parte superior derecha
    icon: icon,             // Tipo de icono (success, error, warning, info, question)
    title: message,         // El mensaje que quieres mostrar
    showConfirmButton: false, // No mostrar el botón de confirmación
    timer: 3000,            // Duración del toast (en milisegundos)
    timerProgressBar: true, // Muestra la barra de progreso
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);  // Detener el timer cuando el mouse entra
      toast.addEventListener('mouseleave', Swal.resumeTimer); // Reanudar el timer cuando el mouse sale
    }
  });
};
export const showConfirmationAlert = (title: string, text: string,  position: 'top-start' | 'top-end' | 'top' | 'center-start' | 'center' | 'center-end' | 'bottom-start' | 'bottom-end' | 'bottom' = 'center'
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    Swal.fire({
    position: position,    // Posición en la parte superior derecha
      title: title,           // Título de la alerta
      text: text,             // Mensaje de la alerta
      icon: 'warning',        // Tipo de icono (advertencia)
      showCancelButton: true, // Habilitar el botón "Cancelar"
      confirmButtonText: 'Aceptar', // Texto del botón "Aceptar"
      cancelButtonText: 'Cancelar', // Texto del botón "Cancelar"
      reverseButtons: true,   // Invierte la posición de los botones
      allowOutsideClick: false          // No permite cerrar la alerta haciendo clic fuera de ella
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true); // Resuelve la promesa como "true" si el usuario hace clic en "Aceptar"
      } else {
        resolve(false); // Resuelve la promesa como "false" si el usuario hace clic en "Cancelar"
      }
    }).catch((error) => {
      reject(error); // Si ocurre algún error, rechaza la promesa
    });
  });
};