import axios from 'axios';

// Configura la instancia de Axios
 const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // Puedes reemplazar con tu URL base
  headers: {
    'Content-Type': 'application/json',
  },
});


export const GetAxios = async (url:string) => {
    const response = await axiosInstance.get(url); // Endpoint para obtener posts
    return response.data;  // Devuelve los datos de la respuesta
  };

// Define el tipo genérico T para la respuesta
// Define el tipo genérico T para la respuesta
export const AxiosRequest = async (
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  values?: Record<string, any>
) => {
  let response;
  
  // Realizar la solicitud según el método
  if (method === 'POST') {
    response = await axiosInstance.post(url, values);
  } else if (method === 'PUT') {
    response = await axiosInstance.put(url, values);
  } else if (method === 'DELETE') {
    response = await axiosInstance.delete(url)
  } else {
    throw new Error('Método no soportado');
  }

  return response.data;
};

