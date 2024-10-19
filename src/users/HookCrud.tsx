import { AxiosGet } from "../axios/axios";
import { User } from "./users/interfaceUsers";

export interface Action {
  type: "add" | "edit" | "delete" | "get" | "setData" | "loading"|"stoploading";
  payload?: User[]; // Cambiamos el tipo de payload a User[]
  
}

interface initialState {
  url: string;
  data: User[]; // Este es un arreglo de usuarios
  status?: "success" | "error";
  loading: boolean; //
}



export const initialState: initialState = {
  url: "/users", // Asegúrate de definir la URL
  data: [],
  status: undefined,
  loading: false,
};

export const reducer = (state: initialState, action: Action): initialState => {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true }; 
      case "stoploading":
      return { ...state, loading: false }; 
    case "setData":
      return { ...state, data: action.payload || [], loading: false, status: "success" }; // Asegúrate de que siempre sea un arreglo

    default:
      return state; // Retornar el estado actual si no hay coincidencias
  }
};
