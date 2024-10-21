import { createContext, useEffect, useState } from "react";
import { TabElement, TabsComponent } from "../components/tabs/Tabs"
import { Users } from "./users/Users"
import { ModalComponent } from "../components/modal/Modal";
import FormUsers from "./form/Form";
import { PermissionComponent } from "./permissions/Permissions";
import { AxiosGet } from "../axios/axios";
interface ContextType {
  // open: boolean;
  setOpen: (open: boolean) => void;
  departamentos:Array<Departamentos>
}
interface Departamentos {
  id: number;
  Departamento: string;
  // Dependencia: string;
 
}

export const ContextUsers = createContext<ContextType | null>(null);
export const IndexUsers=()=>{
  const [open,setOpen] = useState<boolean>(false);
  const [departamentos,setDepartamentos] = useState<Array<Departamentos>>([]);
  useEffect(() => {
    console.log("cargando  index users....");
    const init = async()=>{

      setDepartamentos(await AxiosGet("/departamentos"));
    }
    init();

  }, []); 
return (
 <>

 <ContextUsers.Provider value={{setOpen,departamentos}}>
    <TabsComponent>
        <TabElement title="Usuarios"><Users/></TabElement>
        <TabElement title="Permisos">

        <PermissionComponent />

        </TabElement>
  </TabsComponent>
  <ModalComponent title={'usuarios'} open={open} setOpen={setOpen}messageButton="registrar" handleButton={()=>{}} >
      <FormUsers/>
  </ModalComponent>
 </ContextUsers.Provider>
 </>
)
}