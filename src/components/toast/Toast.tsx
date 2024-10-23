import React, { useEffect, useState } from 'react';

export interface ToastProps {
  loading?: boolean;
  icon?: React.ReactNode;
  title: string | undefined;
  message: string | undefined;
  type: 'success' | 'warning' | 'error' | 'info' | undefined;
}
const ProgressBar: React.FC<{ duration: number }> = ({ duration }) => {
    const [progress, setProgress] = useState(0); // Progreso inicial al 0%
  
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100; // Asegúrate de que no supere el 100%
          }
          return prev + (100 / (duration / 100)); // Aumenta el progreso
        });
      }, 100); // Cambia el valor cada 100 ms
  
      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, [duration]);
  
    return (
      <div className="w-full bg-gray-300 rounded-b-lg h-1 mt-2">
        <div
          className={`h-full bg-green-500 transition-all ease-in-out duration-100`}
          style={{ width: `${progress}%` }} // Establece el ancho de la barra según el progreso
        />
      </div>
    );
  };
  

const ToastComponent: React.FC<ToastProps> = ({ icon, title, message, type, loading=false }) => {
  let bgColor, borderColor;
  const [isvisible,setIsvisible] = useState<boolean>(loading)
  useEffect(() => {
    

  }, [loading]);

  // Definición de colores según el tipo
  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      borderColor = 'border-green-700';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      borderColor = 'border-yellow-700';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      borderColor = 'border-red-700';
      break;
    case 'info':
      bgColor = 'bg-blue-500';
      borderColor = 'border-blue-700';
      break;
    default:
      bgColor = 'bg-gray-500';
      borderColor = 'border-gray-700';
  }

  return (
    <>
      {isvisible && (
       <div className={`fixed bottom-5 right-5 border-l-4 ${borderColor} ${bgColor} text-white rounded-lg px-8 py-3 shadow-lg transition-all ease-in-out duration-300 flex items-start space-x-4 z-50`}>
       
          <div className="flex items-center justify-center h-10 w-10 mt-1 mr-2  rounded-full  text-gray-800">
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">{title}</p>
            <p className="text-sm">{message}</p>
            <ProgressBar duration={2500} /> 
          </div>
          
        </div>
      )}
    </>
  );
};

export default ToastComponent;
