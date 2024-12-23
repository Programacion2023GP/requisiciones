type LogTypes = 'success' | 'error' | 'info' | 'warning';

type AvailableColors = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange' | 'pink' | 'brown' | 'cyan' | 'black';
type FontSize = 'small' | 'medium' | 'large';

export function customLog(message: string, color: AvailableColors = 'black', size: FontSize = 'medium') {
  // Mapa de tamaños
  const sizeMap: Record<FontSize, string> = {
    small: '12px',
    medium: '16px',
    large: '20px',
  };

  const fontSize = sizeMap[size];
  const backgroundColor = 'white';  // Fondo blanco por defecto
  
  // Estilos aplicados
  const styles = `
    color: ${color}; 
    background-color: ${backgroundColor}; 
    font-size: ${fontSize}; 
    font-weight: bold; 
    padding: 5px 10px; 
    border-radius: 3px;
  `;

  console.log(`%c${message}`, styles);
}