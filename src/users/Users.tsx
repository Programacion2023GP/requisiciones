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
  FormikInput,
  FormikSwitch,
} from "../components/formik/FormikInputs/FormikInput";
import Typography from "../components/typografy/Typografy";
import { showToast } from "../sweetalert/Sweetalert";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FormikProps } from "formik";
import Spinner from "../loading/Loading";
import { MdMenu } from "react-icons/md"; // Importar el ícono de menú (hamburger)
import MenuComponent from "../menus/Menus";
import { PermissionMenu } from "../extras/menupermisos";

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
          }}
        >
          <BiEdit />
        </Button>
        </Tooltip>
        <PermissionMenu IdMenu={''} >

     <Tooltip content="asignar permisos al usuario">
     <Button
          color="indigo"
          size="small"
          variant="solid"
          onClick={() => {
            handleEditPermission(data);
          }}
        >
          <MdMenu />
        </Button>
     </Tooltip>
     </PermissionMenu>
     <Tooltip content="eliminar al usuario">

        <Button color="red" size="small" variant="solid" onClick={handleDelete}>
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
    case "AUTORIZADOR":
      classNames = "border-green-500 text-green-500 border-2 p-2 rounded-md"; // Borde y texto verde para 'PRESUPUESTOS'
      break;
    case "CAPTURA":
      classNames = "border-yellow-500 text-yellow-500 border-2 p-2 rounded-md"; // Borde y texto amarillo para 'CAPTURA'
      break;
    case "DIRECTOR":
      classNames = "border-gray-500 text-gray-500 border-2 p-2 rounded-md"; // Borde y texto gris para 'DIRECTOR'
      break;
    case "COMPRAS":
      classNames = "border-purple-500 text-purple-500 border-2 p-2 rounded-md"; // Borde y texto morado para 'COMPRAS'
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

  // Realizas las consultas
  const queries = useQueries({
    queries: [
      {
        queryKey: ["users/index"],
        queryFn: () => GetAxios("users/index"),
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["departamentos/index"],
        queryFn: () => GetAxios("departamentos/index"),
        refetchOnWindowFocus: true,
      },
      // Puedes agregar más peticiones aquí
    ],
  });
  const handleEdit = (data: Record<string, any>) => {
    toggleOpen(); // Optionally open the modal if you're editing
    if (formik) {
      formik.current?.setValues(data); // Directly setting form values using Formik methods
    }
  };
  const handleEditPermission = (data: Record<string, any>) => {
    const generateRandomNumber = () => {
      return Math.floor(Math.random() * 10);  // Genera un número entre 0 y 9
    };
  
    const generateRandomKey = (length: number) => {
      let key = '';
      for (let i = 0; i < length; i++) {
        key += generateRandomNumber();  // Concatenar números aleatorios
      }
      return key;
    };
  
    setPermissionEditUser({
      fullName: data.NombreCompleto,
      Usuario: data.Usuario,
      newKey: generateRandomKey(50),  // Genera una clave con 30 números aleatorios
    });
  };
  

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
        "error"
      );
    },
  });

  const [users, groups] = queries;
  const roles = [
  
  
    {
      id: "REQUISITOR",
      value: "REQUISITOR",
    },
    // {
    //   id: "DIRECTOR",
    //   value: "DIRECTOR",
    // },
    {
      id: "AUTORIZADOR",
      value: "AUTORIZADOR",
    },
  ];

  const [columnDefs] = useState<ColDef<TypeUsers>[]>([
    { headerName: "Nombre", field: "Nombre", sortable: true, filter: true,    
  },
    {
      headerName: "Apellido Paterno",
      field: "Paterno",
      sortable: true,
      filter: true,    

    },
    {
      headerName: "Apellido Materno",
      field: "Materno",
      sortable: true,
      filter: true,    

    },
    {
      headerName: "Nombre Completo",
      field: "NombreCompleto",
      sortable: true,
      filter: true,    

    },

    { headerName: "Usuario", field: "Usuario", sortable: true, filter: true,    
  },
    // { headerName: "Rol", field: "Rol", sortable: true, filter: true },
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
      // field: "Rol", // Usamos colId para identificar la columna sin usar field
      // sortable: true,
      // filter: true,
      cellRenderer: (params: any) => (
        <ActionButtons
          data={params.data}
          mutation={mutation}
          setOpen={setOpen}
          handleEdit={handleEdit}
          handleEditPermission={handleEditPermission}
          // Assert non-null, but make sure formikRef.current is initialized
        />
      ), // Usamos cellRendererFramework
    },
  ]);

  const buttonElement = useMemo(
    () => (
      <Tooltip content="Agregar Usuario">
        <div className="mb-4">
          <Button
            onClick={() => {
              formik.current?.resetForm();
              toggleOpen();
            }}
            size="medium"
            color="blue"
            variant="solid"
          >
            <LuPlus />
          </Button>
        </div>
      </Tooltip>
    ),
    []
  );
  const validationSchema = Yup.object({
    Nombre: Yup.string().required("El nombre es obligatorio"),
    Paterno: Yup.string().required("El apellido paterno es obligatorio"),
    Materno: Yup.string().required("El apellido materno es obligatorio"),
    Usuario: Yup.string().required("El usuario es requerido"),
    IDDepartamento: Yup.number()
      .min(1, "El departamento es obligatorio")
      .required("El departamento es obligatorio"),
    Rol: Yup.string().required("El rol es obligatorio"),
  });
  const responsive = {
    "2xl": 6,
    xl: 6,
    lg: 6,
    md: 12,
    sm: 12,
  };

  const onSumbit = (values: Record<string, any>) => {
    // Llamar a la función mutate para ejecutar la solicitud POST
    mutation.mutate({
      url: "/users/createOrUpdate",
      method: "POST",
      data: values,
    });
  };
  const handlePermissions = () => {};
  return (
    <div className="container mx-auto shadow-lg p-6 border mt-12">
      {mutation.status == "pending" && <Spinner />}
    {permissionEditUser.Usuario !="" && (
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
        }}
      >
        <div className="mt-4"></div>
        <FormikForm
          ref={formik}
          onSubmit={onSumbit}
          buttonMessage={"Registrar"}
          validationSchema={validationSchema}
          initialValues={{
            IDUsuario: null,
            Nombre: null,
            Paterno: null,
            Materno: null,
            IDDepartamento: 0,
            Rol: 0,
            Usuario: "",
            Password: "123456",
            Permiso_Autorizar: false,
            Permiso_Asignar: false,
            Permiso_Cotizar: false,
            Permiso_Surtir: false,
            Permiso_Orden_Compra: false,
          }}
          children={(values) => (
            <>
              <FormikInput
                name="Nombre"
                label="Nombre"
                responsive={responsive}
              />
              <FormikInput
                name="Paterno"
                label="Apellido paterno"
                responsive={responsive}
              />
              <FormikInput
                name="Materno"
                label="Apellido Materno"
                responsive={responsive}
              />
              <FormikInput
                name="Usuario"
                label="Usuario con el que va a iniciar sesión"
                responsive={responsive}
              />
              <FormikAutocomplete
                responsive={responsive}
                loading={groups.isLoading}
                name="IDDepartamento"
                label={"selecciona el departamento"}
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
              {(values.Rol == "AUTORIZADOR" )&& (
                <>
                  <div className="w-full text-start mb-2 ml-3">
                    <Typography
                      variant="h2"
                      size="base"
                      weight="normal"
                      color="gray"
                    >
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
            </>
          )}
        />
      </ModalComponent>

      <div className="ag-theme-alpine w-full mx-auto container p-6">
        <p className="text-center font-semibold text-2xl md:text-3xl text-gray-700 mb-4">
          Usuarios del Sistema
        </p>
        <Agtable
        permissionsUserTable={{
          buttonElement:"Usuarios",
          table:"Usuarios"
        }}
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
