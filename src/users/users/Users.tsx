import { useContext, useEffect, useReducer, useState } from "react";
import { ListComponent } from "../../components/list/ListComponent";
import { Axios, AxiosGet } from "../../axios/axios";
import { ContextUsers } from "..";
import Tooltip from "../../components/toltip/Toltip";
import { SwitchComponent } from "../../components/switch/Switch";

export const Users = () => {
  const context = useContext(ContextUsers)
  if (!context) {
    throw new Error("SomeChildComponent must be used within a ContextUsers.Provider");
  }

  const { setOpen,users,setAlert,getUsers,setModal,setEditUser,loading } = context;

  useEffect(() => {
  
  }, []); // Ejecutar solo una vez al montar el componente

  const handleEdit = (item:Record<string,any>) => {
    setOpen(true); // Invierte el estado

    setModal({title:`${item.fullname}`,messageButton:"Actualizar"})
    setEditUser(item)

    // Aquí puedes manejar las acciones de editar o eliminar
  };
  const handleDelete =(item:Record<string,any>)=>{
    Axios.delete(`users/${item.id}`).then(n=>{
     
      setAlert({loading:true,title:n.data.title,message:n.data.message,type:"success",icon:<i className="ri-shield-user-line ri-2x"></i>});
      getUsers()
      // handleDelete();
    }).catch(e=>{

    })
  }
  const handleSelectAllChange = (it:Record<string,any>)=>{
    Axios.put(`/users/${it!!.id}`, {...it,active:!it.active})
    .then((response) => {
      getUsers();
      setAlert({
        loading: true,
        title: response.data.title,
        message: response.data.message,
        type: "success",
        icon: <i className="ri-information-line ri-2x"></i>,
      });
    })
    .catch((error) => {
      getUsers();
  
      setAlert({
        loading: true,
        title: error.response.data.title,
        message: error.response.data.message,
        type: "error",
        icon: <i className="ri-information-line ri-2x"></i>,
      });
    });
  } 
  return (
    <ListComponent
      title="Usuarios del sistema"
      loading={loading}
      filter
      button
      titleItem="fullname"
      subtitleItem="departamento.group"
      otherItems={['email']}
      
      addIcon={
        <>
          <button
            onClick={()=>{
              setEditUser(null)
              setOpen(true); // Invierte el estado
              setModal({title:"Registro de usuarios",messageButton:"Registrar"})

            }}
            className="ml-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
          >
            <i className="ri-add-line text-2xl"></i> 
          </button>
        </>
      }
      data={users}
      // loading={users.loading}
      buttons={(item) => (
        <>
        <Tooltip content={`click para ${item.active?'desactivar':'activar'} status`}>
              <div className="mt-1">
                <SwitchComponent
                  iconClass={item.active?'ri-check-line':'ri-close-line'} // Icono para "Todos"
                  classChecked={item.active?'bg-green-500':'bg-red-500'} // Color para "Todos"
                  checked={item.active} // Marca "Todos" si todos están seleccionados
                  onChange={()=>{
                    handleSelectAllChange(item)
                  }}
                />
              </div>
            </Tooltip>
          <button
            onClick={()=>{
              handleEdit(item)
            }}
            className="rounded-md bg-yellow-300 px-2 py-1 text-white transition duration-200 hover:bg-yellow-500"
          >
            <i className="ri-edit-box-line"></i>
          </button>
          <button
            onClick={()=>{
              handleDelete(item)
            }}
            className="rounded-md bg-red-300 px-2 py-1 text-white transition duration-200 hover:bg-red-500"
          >
            <i className="ri-delete-bin-6-line"></i>
          </button>
        </>
      )}
    />
  );
};
