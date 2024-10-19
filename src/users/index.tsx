import { createContext, useEffect, useState } from "react";
import { TabElement, TabsComponent } from "../components/tabs/Tabs"
import { Users } from "./users/Users"
import { ModalComponent } from "../components/modal/Modal";
import FormUsers from "./form/Form";

export const IndexUsers=()=>{
  const ContextUsers = createContext(null)
  const [open,setOpen] = useState(false);

  useEffect(() => {
    console.log("cargando  index users....");
  }, []); 
return (
 <>
    <TabsComponent>
        <TabElement title="Usuarios"><Users/></TabElement>
        <TabElement title="Tab 2">Contenido de Tab 2</TabElement>
        <TabElement title="Tab 3">Contenido de Tab 3</TabElement>
  </TabsComponent>
  <ModalComponent title={'usuarios'} open={open} setOpen={setOpen}messageButton="registrar" handleButton={()=>{}} >
      <FormUsers/>
  </ModalComponent>
 </>
)
}