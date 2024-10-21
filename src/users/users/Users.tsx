import { useContext, useEffect, useReducer } from "react";
import { ListComponent } from "../../components/list/ListComponent";
import { Action, reducer, initialState } from "../HookCrud";
import { AxiosGet } from "../../axios/axios";
import { ContextUsers } from "..";

export const Users = () => {
  const [users, setUsers] = useReducer(reducer, initialState);
  const context = useContext(ContextUsers)
  if (!context) {
    throw new Error("SomeChildComponent must be used within a ContextUsers.Provider");
  }

  const { setOpen } = context;

  useEffect(() => {
    const fetchUsers = async () => {
      setUsers({ type: "loading" });
      try {
        const response = await AxiosGet(users.url);
        setUsers({ type: "setData", payload: response || [] });
        setUsers({ type: "stoploading" });
      } catch (error) {}
    };

    fetchUsers();
  }, []); // Ejecutar solo una vez al montar el componente

  const handleClick = () => {
    // Aquí puedes manejar las acciones de editar o eliminar
  };

  return (
    <ListComponent
      reload={() => setUsers({ type: "get" })}
      title="Usuarios del sistema"
      filter
      button
      addIcon={
        <>
          <button
            onClick={()=>{
              setOpen(true); // Invierte el estado
            }}
            className="ml-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
          >
            <i className="ri-add-line text-2xl"></i> {/* Icono de add */}
          </button>
        </>
      }
      data={users.data}
      loading={users.loading}
      buttons={({}) => (
        <>
          <button
            onClick={handleClick}
            className="rounded-md bg-yellow-300 px-2 py-1 text-white transition duration-200 hover:bg-yellow-500"
          >
            <i className="ri-edit-box-line"></i>
          </button>
          <button
            onClick={handleClick}
            className="rounded-md bg-red-300 px-2 py-1 text-white transition duration-200 hover:bg-red-500"
          >
            <i className="ri-delete-bin-6-line"></i>
          </button>
        </>
      )}
    />
  );
};
