import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Agtable } from "../../components/table/Agtable";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { useEffect, useRef, useState } from "react";
import { ColDef } from "ag-grid-community";
import Tooltip from "../../components/toltip/Toltip";
import Button from "../../components/form/Button";
import { BiEdit } from "react-icons/bi";
import PhotoZoom from "../../components/images/Images";
import ModalComponent from "../../components/modal/Modal";
import FormikForm from "../../components/formik/Formik";
import * as Yup from "yup";
import {
  FormikAutocomplete,
  FormikImageInput,
  FormikInput,
  FormikNumberInput,
} from "../../components/formik/FormikInputs/FormikInput";
import { showToast } from "../../sweetalert/Sweetalert";
import Spinner from "../../loading/Loading";
import { FaUserClock, FaUserEdit } from "react-icons/fa";
import Typography from "../../components/typografy/Typografy";
import CardComponent from "../../components/card/Card";
import TransferList from "../../components/transferlist/TransferList";
import { FormikProps } from "formik";

type PropsTable = {
  IdDetDirectores: number;
  IDDepartamento: number;
  Nombre_Director: string | null;
  Centro_Costo: number | null;
  Firma_Director: string | null;
  NombreCompleto?: string | null;
  Nombre_Departamento: string | null;
  IDUsuario?: number;

};

type PropsForm  = {
  IdDetDirectores: number;
  IDDepartamento: number;
  IDUsuario: number;
  Centro_Costo: number | null;
  Firma_Director: string | null;
  NombreCompleto?: string | null;
  Nombre_Departamento: string | null;
};

const ActionButtons = ({
  data,
  handleEdit,
  // mutation,
  // setOpen,
  // handleEdit,
}: {
  data: PropsTable;
  // mutation: any;
  // setOpen: Dispatch<SetStateAction<boolean>>;
  // handleEdit: (data: Record<string, any>) => void;
  handleEdit: (provedor: PropsTable) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openDirectores, setOpenDirectores] = useState<boolean>(false)
  const [openName,setOpenName] = useState<boolean>(false);
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
        queryKey: ["catDepartaments/index"],
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al realizar la acción";
      showToast(message, "error");
    },
  });

  const initialValues = {
    IDDepartamento: data.IDDepartamento,
    Centro_Costo: data.Centro_Costo,
  };
  const initialValuesName = {
    IDDepartamento: data.IDDepartamento,
    Nombre_Departamento: data.Nombre_Departamento,
  };
  const validationSchema = Yup.object({
    IDDepartamento: Yup.number()
      .min(1, "El departamento es requerido")
      .required("El departamento es requerido"),
    Centro_Costo: Yup.number()
      .min(1, "El centro de costo es requerido")
      .required("El centro de costo es requerido"),
  });
  const queryClient = useQueryClient(); // Inicializa el query client

  const onSubmit = (values: Record<string, any>) => {
    mutation.mutate({
      method: "PUT",
      url: "departaments/update",
      data: values,
    });
  };
   const onSubmitName = (values: Record<string, any>) => {
    mutation.mutate({
      method: "POST",
      url: "departaments/changename",
      data: values,
    });
  };
  return (
    <>
      <div className="flex gap-2">
        
        <Tooltip content="Editar centro de costo">
          <Button
            color="yellow"
            size="small"
            variant="solid"
            onClick={() => {
              setOpen(true);
            }}
          >
            <BiEdit />
          </Button>
        </Tooltip>
          <Tooltip content="Editar Nombre del departamento">
          <Button
            color="presidencia"
            size="small"
            variant="solid"
            onClick={() => {
              setOpenName(true);
            }}
          >
            <BiEdit />
          </Button>
        </Tooltip>
        <Tooltip content="Historial Directores">
          <Button
            color="indigo"
            size="small"
            variant="solid"
            onClick={() => {
              setOpenDirectores(true);
            }}
          >
            <FaUserClock />
          </Button>
        </Tooltip>
        <ModalComponent
          title="Editar centro de costo"
          open={open}
          setOpen={() => {
            setOpen(false);
          }}
        >
          <FormikForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            buttonMessage="Actualizar"
            onSubmit={onSubmit}
            children={(values, setValue, setTouched, errors) => (
              <>
                <div className="mb-2"></div>
                <Typography className="w-full text-center">
                  {" "}
                  {data.Nombre_Departamento}
                </Typography>
                <FormikNumberInput
                  label="Centro de costo"
                  name="Centro_Costo"
                  decimals={false}
                />
              </>
            )}
          />
        </ModalComponent>

        <ModalComponent title={`Historial de directores del departamento`} open={openDirectores} setOpen={() => { setOpenDirectores(false) }}>
        <Directores data={data}/>
        </ModalComponent>
        
        <ModalComponent title={`Cambio de nombre del departamento ${data.Nombre_Departamento}`} open={openName} setOpen={() => { setOpenName(false) }}>
         <FormikForm
            initialValues={initialValuesName}
            // validationSchema={validationSchema}
            buttonMessage="Actualizar"
            onSubmit={onSubmitName}
            children={(values, setValue, setTouched, errors) => (
              <>
                <div className="mb-2"></div>
                <FormikInput
                  label="Nombre del departamento"
                  name="Nombre_Departamento"
                  // decimals={false}
                />
              </>
            )}
          />
        </ModalComponent>
      </div>
    </>
  );
};
const Picture = ({ data }: { data: PropsTable }) => {
  return (
    <PhotoZoom
      src={`${data.Firma_Director}`}
      alt={"Firma del director " + (data.Nombre_Director !=null? data.Nombre_Director:"" )}
      title={data?.Nombre_Director || ""}
    ></PhotoZoom>
  );
};


const Directores = ({ data }: { data: PropsTable }) => {
  
  const [columnDefs] = useState<ColDef<PropsTable>[]>([
    {
      headerName: "Director",
      field: "Nombre_Director",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Departamento",
      field: "Nombre_Departamento",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Centro Costo",
      field: "Centro_Costo",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Firma",
      field: "Firma_Director", // Usamos colId para identificar la columna sin usar field
      sortable: true,
      filter: true,

      cellRenderer: (params: any) => <Picture data={params.data} />, // Usamos cellRendererFramework
    },
  
  ]);
   const queries = useQueries({
    queries: [
      {
        queryKey: ["director/index", data?.NombreCompleto], // 👈 clave dependiente
        queryFn: () => GetAxios(`departaments/director/${data?.IDDepartamento}`),
        refetchOnWindowFocus: true,
      },
   
      // Puedes agregar más peticiones aquí
    ],
  });
  const [directores] = queries
   useEffect(() => {
    if (data?.IDDepartamento) {
      directores.refetch();
    }
  }, [data?.IDDepartamento]);
  return (
    <Agtable
      loading={directores.isLoading}
      data={directores?.data?.data}
      isLoading={directores.isLoading}
      columnDefs={columnDefs}
      buttonElement={<></>}
      permissionsUserTable={{
        buttonElement: "",
        table: "CatDepartamentos",
      }}
    />
  );
};

const CatDepartaments = () => {
     const formik = useRef<FormikProps<Record<string, any>> | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [spiner, setSpiner] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<PropsTable>({
    IDUsuario: 0,
    Nombre_Director:"",
    Firma_Director: null,
    IDDepartamento: 0,
    IdDetDirectores: 0,
    NombreCompleto: null,
    Nombre_Departamento: null,
    Centro_Costo: null,
    
  });
  const queries = useQueries({
    queries: [
      {
        queryKey: ["catDepartaments/index"],
        queryFn: () => GetAxios("departaments/index"),
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["users/index"],
        queryFn: () => GetAxios("users/index"),
        refetchOnWindowFocus: true,
      },
       {
            queryKey: ["departamentos/index"],
            queryFn: () => GetAxios("departamentos/index"),
            refetchOnWindowFocus: true,
         }
      // Puedes agregar más peticiones aquí
    ],
  });
  const handleEdit = (director: PropsTable): void => {
    setInitialValues(director);
    setOpen(true);
  };
  const [columnDefs] = useState<ColDef<PropsTable>[]>([
    {
      headerName: "Director",
      field: "Nombre_Director",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Departamento",
      field: "Nombre_Departamento",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Centro Costo",
      field: "Centro_Costo",
      sortable: true,
      filter: true,
    },

    {
      headerName: "Firma",
      field: "Firma_Director", // Usamos colId para identificar la columna sin usar field
      sortable: true,
      filter: true,

      cellRenderer: (params: any) => <Picture data={params.data} />, // Usamos cellRendererFramework
    },
    {
      headerName: "Acciones",
      colId: "buttons",

      cellRenderer: (params: any) => (
        <ActionButtons handleEdit={handleEdit} data={params.data} />
      ),
    },
  ]);
  const [departaments, users,groups] = queries;
  const onSubmit = async (values: Record<string, any>) => {
    setSpiner(true);
    console.log(values)
    const formData = new FormData();
    formData.append("IDDepartamento", values.IDDepartamento);
    formData.append("IDUsuario", values.IDUsuario);
    formData.append("Firma_Director", values.Firma_Director);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departaments/create`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        setSpiner(false);

        const errorData = await response.json().catch(() => ({})); // Si el cuerpo no es JSON
        showToast("No se pudo registrar al director", "error");

        return;
      }

      const data = await response.json();
      if (data && data?.message && data?.status) {
        showToast(data?.message, data?.status);
      }
      setOpen(false);
      queryClient.refetchQueries({
        queryKey: ["catDepartaments/index"],
      });
      setSpiner(false);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const validationSchema = Yup.object({
    IDDepartamento: Yup.number()
      .min(1, "El departamento es requerido")
      .required("El departamento es requerido"),
    // IDUsuario: Yup.string().required("El director es requerido"),
    Firma_Director: Yup.mixed()
      .required("La firma es obligatoria")
      .test("fileType", "Solo se permiten archivos de imagen", (value) => {
        if (value && value instanceof File) {
          return value.type.startsWith("image/");
        }
        return false;
      })
      .test(
        "fileSize",
        "El archivo debe tener un tamaño máximo de 2 MB",
        (value) => {
          if (value && value instanceof File) {
            return value.size <= 2 * 1024 * 1024; // 2MB en bytes
          }
          return true;
        }
      ),
  });
  const queryClient = useQueryClient(); // Inicializa el query client
const handleChange = (ids: number[]) => {

      formik.current?.setFieldValue("IDDepartamentos", ids);
   };
  return (
    <div className="container mx-auto shadow-lg p-6 border mt-12">
      {spiner && <Spinner />}

      <div className="ag-theme-alpine w-full mx-auto container p-6">
      
     
        <Agtable
          permissionsUserTable={{
            buttonElement: "CatDepartamentos",
            table: "CatDepartamentos",
          }}
          loading={departaments.status == "pending" ? true : false}
          data={departaments?.data?.data}
          isLoading={departaments.isLoading}
          columnDefs={columnDefs}
          buttonElement={<></>}
        // data={users.data?.data}
        />
        <ModalComponent children={undefined} open={modal} setOpen={() => { setModal(false) }} />

      </div>
    </div>
  );
};
export default CatDepartaments;
