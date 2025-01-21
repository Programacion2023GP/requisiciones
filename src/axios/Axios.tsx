import axios from "axios";

// Configura la instancia de Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL base
  headers: {
    "Content-Type": "application/json",
    
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Obtener el token de localStorage
  },
});

// O si prefieres hacerlo dinámicamente en cada solicitud:
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token desde localStorage o el lugar que uses para guardarlo
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Agregar el token a los encabezados
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const GetAxios = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error en la solicitud:", error);
    if (error.response && error.response.status === 401) {
      // localStorage.clear();
      // window.location.href = "/";
    }
  }
};

// Define el tipo genérico T para la respuesta
// Define el tipo genérico T para la respuesta
export const AxiosRequest = async (
  url: string,
  method: "POST" | "PUT" | "DELETE",
  values?: Record<string, any>
) => {
  try {
    let response;

    // Realizar la solicitud según el método
    if (method === "POST") {
      response = await axiosInstance.post(url, values);
    } else if (method === "PUT") {
      response = await axiosInstance.put(url, values);
    } else if (method === "DELETE") {
      response = await axiosInstance.delete(url);
    } else {
      throw new Error("Método no soportado");
    }
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // localStorage.clear();
      // window.location.href = "/";
    } else {
      return error.response.data;
    }

    // Manejo de otros errores
  }
};
