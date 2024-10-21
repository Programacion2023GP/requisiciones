import { createContext, useEffect, useState } from "react";
import { TabElement, TabsComponent } from "../components/tabs/Tabs"
import { Users } from "./users/Users"
import { ModalComponent } from "../components/modal/Modal";
import FormUsers from "./form/Form";
import { PermissionComponent } from "./permissions/Permissions";
interface ContextType {
  // open: boolean;
  setOpen: (open: boolean) => void;
}


export const ContextUsers = createContext<ContextType | null>(null);
export const IndexUsers=()=>{
  const [open,setOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log("cargando  index users....");
  }, []); 
return (
 <>

 <ContextUsers.Provider value={{setOpen}}>
    <TabsComponent>
        <TabElement title="Usuarios"><Users/></TabElement>
        <TabElement title="Permisos">

        <PermissionComponent />

        </TabElement>
  </TabsComponent>
 </ContextUsers.Provider>
  <ModalComponent title={'usuarios'} open={open} setOpen={setOpen}messageButton="registrar" handleButton={()=>{}} >
      <FormUsers/>
  </ModalComponent>
 </>
)
}