import { createContext, useEffect, useState } from "react";
import { TabElement, TabsComponent } from "../components/tabs/Tabs"
import { Users } from "./users/Users"
import { ModalComponent } from "../components/modal/Modal";
import FormUsers from "./form/Form";
import { PermissionComponent } from "./permissions/Permissions";
import { AxiosGet } from "../axios/axios";
import ToastComponent, { ToastProps } from "../components/toast/Toast";
import { UsersHook } from "./usersHook";
interface ContextType {
  // open: boolean;
  setOpen: (open: boolean) => void;
  setAlert: (props: ToastProps) => void;
  departamentos:Array<Departamentos>,
  users:Array<any>,
  setModal :(modal:MessageModal)=>void;
  getUsers:()=>void,
  edituser:Record<any,any>,
  setEditUser:(user:any)=>void,
  modal:MessageModal|undefined,
  menu:Array<Permisions>,
  loading:boolean,
  permissionUser?:UserChecboxPermissions,
  setPermissionUser:(userPermission:UserChecboxPermissions)=>void,
}
interface Departamentos {
  id: number;
  group: string;
  // Dependencia: string;
 
}

interface MessageModal {
  title: string;
  messageButton: string;

}


interface Permisions {
  id: number;
  name: string;
  submenu: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  submenus?: Array<any>; // Incluimos los submenús
}
interface UserChecboxPermissions{
  id:number,
  checkbox:Array<CheckboxPermissions>
}
interface CheckboxPermissions {
  id:number,
  read:boolean,
  write:boolean,
  edit:boolean,
  delete:boolean,
}
export const ContextUsers = createContext<ContextType | null>(null);
export const IndexUsers=()=>{
  const {users,getUsers,edituser,setEditUser,loading} =UsersHook()
  const [open,setOpen] = useState<boolean>(false);
  const [toast,setToast] = useState<ToastProps>();
  const [modal,setModal] = useState<MessageModal>()
  const [departamentos,setDepartamentos] = useState<Array<Departamentos>>([]);
  const [menu,setMenu] = useState<Array<Permisions>>([])
  const [permissionUser,setPermissionUser] = useState<UserChecboxPermissions>()
  useEffect(() => {
    console.log("cargando  index users....");
    const init = async()=>{
 
      setDepartamentos(await AxiosGet("/departamentos"));
      setMenu(await AxiosGet("/menus"))
    }
    init();

  }, []); 
  const setAlert = (toast:ToastProps)=>{
    setToast(toast);
    setTimeout(() => {
      setToast({ loading: false,message:"",title:"",type:"error" });
    }, 2500);
  }
return (
 <>
  {toast?.loading && (<ToastComponent loading={toast?.loading}  title={toast?.title} message={toast?.message} type={toast?.type} icon={toast?.icon}/>
)}
 <ContextUsers.Provider value={{setOpen,setAlert,departamentos,users,getUsers,setModal,edituser,setEditUser,modal,menu,loading,permissionUser,setPermissionUser}}>
    <TabsComponent>
        <TabElement title="Usuarios"><Users/></TabElement>
        <TabElement title="Permisos">

        <PermissionComponent />

        </TabElement>
  </TabsComponent>
  <ModalComponent title={modal?.title} open={open} setOpen={setOpen} handleButton={()=>{}} >
      <FormUsers />
  </ModalComponent>
 </ContextUsers.Provider>
 </>
)
}