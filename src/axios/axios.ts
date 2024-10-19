// src/axiosInstance.ts
import axios, { AxiosResponse } from "axios";

// Crear una instancia de Axios
export const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000, // Tiempo de espera en milisegundos
  headers: {
    "Content-Type": "application/json",
  },
});

export const AxiosGet = async (url: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await Axios.get(url);
    
    return response.data.data; // Retorna solo los datos si es necesario
  } catch (error) {
    console.error('Error al realizar la solicitud GET:', error);
    // throw error; // Lanza el error para que pueda ser manejado por el llamador
  }
};
// Exportar la instancia para usarla en otros archivos
