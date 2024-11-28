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
