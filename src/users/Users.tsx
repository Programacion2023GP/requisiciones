import Button from "../components/form/Button";
import { ColDef } from "ag-grid-community";
import {
   Dispatch,
   SetStateAction,
   useEffect,
   useMemo,
   useRef,
   useState,
} from "react";
import {
   useMutation,
   useQueries,
   useQuery,
   useQueryClient,
} from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../axios/Axios";
import { TypeUsers } from "./types/TypeUsers";
import { LuPlus } from "react-icons/lu";
import Tooltip from "../components/toltip/Toltip";
import { ModalComponent } from "../components/modal/Modal";
import { Agtable } from "../components/table/Agtable";
import FormikForm from "../components/formik/Formik";
import * as Yup from "yup";
import {
   FormikAutocomplete,
   FormikCheckbox,
   FormikImageInput,
   FormikInput,
   FormikSwitch,
} from "../components/formik/FormikInputs/FormikInput";
import Typography from "../components/typografy/Typografy";
import { showToast } from "../sweetalert/Sweetalert";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FormikProps, useFormik } from "formik";
import Spinner from "../loading/Loading";
import { MdMenu } from "react-icons/md"; // Importar el ícono de menú (hamburger)
import MenuComponent from "../menus/Menus";
import { PermissionMenu } from "../extras/menupermisos";
import TransferList from "../components/transferlist/TransferList";
import icons from "./../constants/icons";

const ActionButtons = ({
   data,
   mutation,
   setOpen,
   handleEdit,
   handleEditPermission,
}: {
   data: Record<string, any>;
   mutation: any;
   setOpen: Dispatch<SetStateAction<boolean>>;
   handleEdit: (data: Record<string, any>) => void;
   handleEditPermission: (data: Record<string, any>) => void;
}) => {
   const handleDelete = () => {
      mutation.mutate({
         url: `/users/delete/${data.IDUsuario}`,
         method: "DELETE",
      });
   };

   return (
      <>
         <div className="flex gap-2">
            <Tooltip content="editar al usuario">
               <Button
                  color="yellow"
                  size="small"
                  variant="solid"
                  onClick={() => {
                     handleEdit(data);
                  }}>
                  <BiEdit />
               </Button>
            </Tooltip>
            <PermissionMenu IdMenu={"Permisos"}>
               <Tooltip content="asignar permisos al usuario">
                  <Button
                     color="indigo"
                     size="small"
                     variant="solid"
                     onClick={() => {
                        handleEditPermission(data);
                     }}>
                     <MdMenu />
                  </Button>
               </Tooltip>
            </PermissionMenu>
            <Tooltip content="eliminar al usuario">
               <Button
                  color="red"
                  size="small"
                  variant="solid"
                  onClick={handleDelete}>
                  <MdDelete />
               </Button>
            </Tooltip>
         </div>
      </>
   );
};

const TypeRolUser = (data: Record<string, any>) => {
   const { Rol } = data.data;
   let classNames = "";

   // Asignar clases de borde según el rol
   switch (Rol) {
      case "REQUISITOR":
         classNames = "border-blue-500 text-blue-500 border-2 p-2 rounded-md"; // Borde y texto azul para 'REQUISITOR'
         break;
      case "DIRECTORCOMPRAS":
         classNames =
            "border-black bg-black text-white font-bold border-2 p-2 rounded-md"; // Borde y texto verde para 'PRESUPUESTOS'
         break;
      case "AUTORIZADOR":
         classNames = "border-green-500 text-green-500 border-2 p-2 rounded-md"; // Borde y texto verde para 'PRESUPUESTOS'
         break;
      case "CAPTURA":
         classNames =
            "border-yellow-500 text-yellow-500 border-2 p-2 rounded-md"; // Borde y texto amarillo para 'CAPTURA'
         break;
      case "DIRECTOR":
         classNames = "border-gray-500 text-gray-500 border-2 p-2 rounded-md"; // Borde y texto gris para 'DIRECTOR'
         break;
      case "COMPRAS":
         classNames =
            "border-purple-500 text-purple-500 border-2 p-2 rounded-md"; // Borde y texto morado para 'COMPRAS'
         break;
      default:
         // Sin clases si no coincide con ningún rol
         break;
   }

   // Retornar el JSX con el rol y las clases correspondientes
   return (
      <div
         className={`${classNames} `} // Borde de 2px
      >
         {Rol}
      </div>
   );
};

// const departmentsStorage = JSON.parse(localStorage.getItem("group") ?? "[]");
const Users = () => {
   const formik = useRef<FormikProps<Record<string, any>> | null>(null);
   const [open, setOpen] = useState<boolean>(false);
   const toggleOpen = () => {
      setOpen(true);
   };
   const [permissionEditUser, setPermissionEditUser] = useState({
      fullName: "",
      Usuario: "",
      newKey: "", // Inicializado en 1
   });

   const queryClient = useQueryClient(); // Inicializa el query client
   const [usersFormik, setUsersFormik] = useState<Record<string, any>>({
      IDUsuario: null,
      Nombre: null,
      Paterno: null,
      Materno: null,
      IDDepartamento: 0,
      IDDepartamentos: null,
      Rol: 0,
      Usuario: "",
      Password: "123456",
      Permiso_Autorizar: false,
      Permiso_Asignar: false,
      Permiso_Cotizar: false,
      Permiso_Surtir: false,
      Permiso_Orden_Compra: false,
      accept_Director:false,
      firma_Director:""
   });
   // Realizas las consultas
   const queries = useQueries({
      queries: [
         {
            queryKey: ["departamentos/index"],
            queryFn: () => GetAxios("departamentos/index"),
            refetchOnWindowFocus: true,
         },
         {
            queryKey: ["users/index"],
            queryFn: () => GetAxios("users/index"),
            refetchOnWindowFocus: true,
         },

         // Puedes agregar más peticiones aquí
      ],
   });

   const handleEdit = (data: Record<string, any>) => {
      toggleOpen(); // Optionally open the modal if you're editing
      let item = data
     item.IDDepartamentos = data?.IDDepartamentos?.split(",").map(it=>Number(it));
     console.log("aqui",item)
      setUsersFormik(item);
      data?.IDUsuario &&
         data?.IDUsuario > 0 &&
         formik.current?.setFieldValue("Usuario", data.Usuario);
   };
   const handleEditPermission = (data: Record<string, any>) => {
      const generateRandomNumber = () => {
         return Math.floor(Math.random() * 10); // Genera un número entre 0 y 9
      };

      const generateRandomKey = (length: number) => {
         let key = "";
         for (let i = 0; i < length; i++) {
            key += generateRandomNumber(); // Concatenar números aleatorios
         }
         return key;
      };

      setPermissionEditUser({
         fullName: data.NombreCompleto,
         Usuario: data.Usuario,
         newKey: generateRandomKey(50), // Genera una clave con 30 números aleatorios
      });
   };

   // useEffect(()=>{
   //   console.log("my info",usersFormik)
   // },[usersFormik])

   // Realizas la mutación
   const mutation = useMutation({
      mutationFn: ({
         url,
         method,
         data,
      }: {
         url: string;
         method: "POST" | "PUT" | "DELETE";
         data?: any;
      }) => AxiosRequest(url, method, data),
      onSuccess: (data) => {
         setOpen(false);
         showToast(data.message, data.status);
         queryClient.refetchQueries({
            queryKey: ["users/index"],
         });
      },
      onError: (error: any) => {
         showToast(
            error.response?.data?.message || "Error al realizar la acción",
            "error",
         );
      },
   });
   const [groups, users] = queries;

   const roles = [
      {
         id: "REQUISITOR",
         value: "REQUISITOR",
      },
      {
         id: "DIRECTOR",
         value: "DIRECTOR",
      },
      {
         id: "DIRECTORCOMPRAS",
         value: "DIRECTOR COMPRAS",
      },
      {
         id: "CAPTURA",
         value: "CAPTURA",
      },
      {
         id: "AUTORIZADOR",
         value: "AUTORIZADOR",
      },
   ];

   const [columnDefs] = useState<ColDef<TypeUsers>[]>([
      {
         headerName: "Nombre Completo",
         field: "NombreCompleto",
         sortable: true,
         filter: true,
      },
      {
         headerName: "Departamento",
         field: "Nombre_Departamento",
         sortable: true,
         filter: true,
      },

      { headerName: "Usuario", field: "Usuario", sortable: true, filter: true },
      {
         headerName: "Rol",
         field: "Rol", // Usamos colId para identificar la columna sin usar field
         sortable: true,
         filter: true,

         cellRenderer: (params: any) => <TypeRolUser data={params.data} />, // Usamos cellRendererFramework
      },
      {
         headerName: "Acciones",
         colId: "buttons",

         cellRenderer: (params: any) => (
            <ActionButtons
               data={params.data}
               mutation={mutation}
               setOpen={setOpen}
               handleEdit={handleEdit}
               handleEditPermission={handleEditPermission}
            />
         ),
      },
   ]);

   const buttonElement = useMemo(
      () => (
         <Tooltip content="Agregar Usuario">
            <div className="mb-4">
               <Button
                  onClick={() => {
                     setUsersFormik({
                        IDUsuario: null,
                        Nombre: null,
                        Paterno: null,
                        Materno: null,
                        IDDepartamento: 0,
                        IDDepartamentos: null,
                        Rol: 0,
                        Usuario: "",
                        Password: "123456",
                        Permiso_Autorizar: false,
                        Permiso_Asignar: false,
                        Permiso_Cotizar: false,
                        Permiso_Surtir: false,
                        Permiso_Orden_Compra: false,
                     });
                     // formik.current?.resetForm();
                     toggleOpen();
                  }}
                  size="medium"
                  color="blue"
                  variant="solid">
                  <icons.Tb.TbUserPlus />
               </Button>
            </div>
         </Tooltip>
      ),
      [],
   );
   const validationSchema = Yup.object({
      Nombre: Yup.string().required("El nombre es obligatorio"),
      Paterno: Yup.string().required("El apellido paterno es obligatorio"),
      Materno: Yup.string().required("El apellido materno es obligatorio"),
      Usuario: Yup.string().required("El usuario es requerido"),
      IDDepartamento: Yup.number()
         .min(1, "El departamento es obligatorio")
         .required("El departamento es obligatorio"),
      IDDepartamentos: Yup.array()
         .of(Yup.number())
         .min(
            1,
            "Es necesario asignar mínimo su departamento principal en el listado",
         )
         .test(
            "validateRelUsuarioDepartamentos",
            "Debes de ingresar minimo el mismo departamento que seleccionaste en 'Departamento principal'",
            (departamentos, context) => {
               console.log(
                  "formik.current.values",
                  formik?.current?.values.IDDepartamento,
               );
               console.log("validateRelUsuarioDepartamentos", departamentos);
               const { IDDepartamento } = context.parent; // accede a otros campos del form
               if (!IDDepartamento || !Array.isArray(departamentos))
                  return false;
               return departamentos.includes(IDDepartamento);
            },
         ),
      Rol: Yup.string()
         .oneOf(
            [
               "REQUISITOR",
               "DIRECTOR",
               "AUTORIZADOR",
               "CAPTURA",
               "DIRECTORCOMPRAS",
            ],
            "Selecciona un rol válido",
         ) // Aquí validamos que el valor esté entre los roles permitidos
         .required("El rol es obligatorio"),
   });
   const responsive = {
      "2xl": 6,
      xl: 6,
      lg: 6,
      md: 12,
      sm: 12,
   };

  const onSumbit = (values: Record<string, any>) => {
   values.Password = `${values.Usuario}*`;

   if (values.Rol == "DIRECTORCOMPRAS") {
      values.Permiso_Asignar = true;
      values.Permiso_Autorizar = true;
      values.Permiso_Cotizar = true;
      values.Permiso_Orden_Compra = true;
      values.Permiso_Surtir = true;
   }
   if (values.Rol == "DIRECTOR") {
      values.Permiso_Autorizar = true;
   }
   if (values.Rol == "REQUISITOR") {
      values.Permiso_Cotizar = true;
   }

   // Crear FormData para incluir imagen
   const formData = new FormData();

   // Recorremos todas las keys del objeto
   Object.entries(values).forEach(([key, value]) => {
      // Si es null o undefined, lo enviamos como vacío
      if (value === null || value === undefined) {
         formData.append(key, "");
         return;
      }

      // Si es un array (por ejemplo, IDDepartamentos)
      if (Array.isArray(value)) {
         value.forEach((val) => {
            formData.append(`${key}[]`, String(val));
         });
         return;
      }

      // Si es un archivo (firma del director)
      if (key === "firma_Director" && value instanceof File) {
         formData.append(key, value);
         return;
      }

      // Para cualquier otro tipo de dato
      formData.append(key, String(value));
   });

   // Mutación usando FormData
   mutation.mutate({
      url: "/users/createOrUpdate",
      method: "POST",
      data: formData,
   });
};

   const handleModified = (
      values: Record<string, any>,
      setFieldValue: (
         name: string,
         value: any,
         shouldValidate?: boolean,
      ) => void,
      touchedFields?: Record<string, boolean>, // <- nuevo: puedes pasar los campos que el usuario modificó
   ) => {
      const year = new Date().getFullYear().toString().slice(-2); // últimos 2 dígitos del año

      const capitalizeFirst = (str: string) =>
         str ? str.charAt(0).toUpperCase() : "";

      const capitalizeFull = (str: string) =>
         str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

      const removeAccents = (str: string) =>
         str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Si el usuario editó manualmente el campo Usuario, no lo modifiques
      if (touchedFields?.Usuario) return;

      const firstName = values["Nombre"]?.split(" ")[0] || "";

      const username =
         capitalizeFull(firstName) +
         capitalizeFirst(values["Paterno"]) +
         capitalizeFirst(values["Materno"]) +
         "-" +
         year;

      // Filtrar acentos antes de guardar
      if (values?.IDUsuario < 1)
         setFieldValue("Usuario", removeAccents(username));
   };

   const handleChange = (ids: number[]) => {
      formik.current?.setFieldValue("IDDepartamentos", ids);
   };

   const handlePermissions = () => { };
   return (
      <div className="container p-6 mx-auto mt-12 border shadow-lg">
         {mutation.status == "pending" && <Spinner />}
         {permissionEditUser.Usuario != "" && (
            <MenuComponent
               newKey={permissionEditUser?.newKey}
               fullName={permissionEditUser?.fullName}
               Usuario={permissionEditUser?.Usuario}
            />
         )}

         <ModalComponent
            title="Usuarios"
            open={open}
            setOpen={() => {
               setOpen(false);
            }}>
            <div className="mt-4"></div>
            <FormikForm
               ref={formik}
               onSubmit={onSumbit}
               buttonMessage={
                  usersFormik.IDUsuario > 0 ? "Actualizar" : "Registrar"
               }
               validationSchema={validationSchema}
               initialValues={usersFormik}
               children={(
                  values,
                  setFieldValue,
                  setTouched,
                  errors,
                  touched,
               ) => (
                  <>
                     <FormikInput
                        name="Nombre"
                        label="Nombre"
                        responsive={responsive}
                        handleModified={handleModified}
                     />
                     <FormikInput
                        name="Paterno"
                        label="Apellido paterno"
                        responsive={responsive}
                        handleModified={handleModified}
                     />
                     <FormikInput
                        name="Materno"
                        label="Apellido Materno"
                        responsive={responsive}
                        handleModified={handleModified}
                     />
                     <FormikInput
                        name="Usuario"
                        label="Usuario con el que va a iniciar sesión"
                        responsive={responsive}
                     // handleModified={}
                     />
                     <FormikAutocomplete
                        responsive={responsive}
                        loading={groups.isLoading}
                        name="IDDepartamento"
                        label={"selecciona el departamento principal"}
                        options={groups.data?.data}
                        idKey={"IDDepartamento"}
                        labelKey={"Nombre_Departamento"}
                     />

                     <FormikAutocomplete
                        responsive={responsive}
                        loading={false}
                        name="Rol"
                        label={"selecciona un rol"}
                        options={roles}
                        idKey={"id"}
                        labelKey={"value"}
                     />
                     {(values.Rol == "AUTORIZADOR" ||
                        values.Rol == "CAPTURA") && (
                           <>
                              <div className="w-full mb-2 ml-3 text-start">
                                 <Typography
                                    variant="h2"
                                    size="base"
                                    weight="normal"
                                    color="gray">
                                    Selecciona los permisos que se le otorgaran :
                                 </Typography>
                              </div>
                              <FormikSwitch
                                 name="Permiso_Autorizar"
                                 label="Autorizar"
                                 responsive={{
                                    "2xl": 4,
                                    xl: 12,
                                    lg: 12,
                                    md: 12,
                                    sm: 12,
                                 }}
                              />
                              <FormikSwitch
                                 name="Permiso_Asignar"
                                 label="Asignar"
                                 responsive={{
                                    "2xl": 4,
                                    xl: 12,
                                    lg: 12,
                                    md: 12,
                                    sm: 12,
                                 }}
                              />
                              <FormikSwitch
                                 name="Permiso_Cotizar"
                                 label="Cotizar"
                                 responsive={{
                                    "2xl": 4,
                                    xl: 12,
                                    lg: 12,
                                    md: 12,
                                    sm: 12,
                                 }}
                              />

                              <FormikSwitch
                                 name="Permiso_Orden_Compra"
                                 label="Orden de compra"
                                 responsive={{
                                    "2xl": 4,
                                    xl: 12,
                                    lg: 12,
                                    md: 12,
                                    sm: 12,
                                 }}
                              />
                              <FormikSwitch
                                 name="Permiso_Surtir"
                                 label="Surtir"
                                 responsive={{
                                    "2xl": 4,
                                    xl: 12,
                                    lg: 12,
                                    md: 12,
                                    sm: 12,
                                 }}
                              />
                           </>
                        )}
             
                     <TransferList
                        name={"IDDepartamentos"}
                        error={
                           touched?.["IDDepartamentos"] &&
                              typeof errors?.["IDDepartamentos"] === "string"
                              ? (errors?.["IDDepartamentos"] as string)
                              : null
                        }
                        departamentos={groups?.data?.data}
                        seleccionados={
                           Array.isArray(values?.IDDepartamentos)
                              ? values.IDDepartamentos.map(Number)
                              : typeof values?.IDDepartamentos === "string" &&
                                 values.IDDepartamentos.length > 0
                                 ? values.IDDepartamentos.split(",").map((it) =>
                                    Number(it),
                                 )
                                 : []
                        }
                        onChange={handleChange}
                     />
                             {values.Rol == "DIRECTOR" && (
                        <>
                              <FormikImageInput
                                 label="Subir la firma del director"
                                 name="firma_Director"
                                 disabled={false}
                                 acceptedFileTypes="png,jpg,jpeg"
                              />
                           <FormikSwitch
                              name="accept_Director"
                              label="Aprobar a director oficial de los departamentos"
                              responsive={{
                                 "2xl": 4,
                                 xl: 12,
                                 lg: 12,
                                 md: 12,
                                 sm: 12,
                              }}
                           />
                        </>
                     )}
                  </>
               )}
               
            />
         </ModalComponent>

         <div className="container w-full p-6 mx-auto ag-theme-alpine">
            <PermissionMenu IdMenu={"Usuarios"}>
               <p className="mb-4 text-2xl font-semibold text-center text-gray-700 md:text-3xl">
                  Usuarios del Sistema
               </p>
            </PermissionMenu>
            <Agtable
               permissionsUserTable={{
                  buttonElement: "Usuarios",
                  table: "Usuarios",
               }}
               loading={users.status == "pending" ? true : false}
               data={users?.data?.data}
               isLoading={users.isLoading}
               columnDefs={columnDefs}
               buttonElement={buttonElement}
            // data={users.data?.data}
            />
         </div>
      </div>
   );
};

export default Users;
