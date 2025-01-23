import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Agtable } from "../../components/table/Agtable";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { useState } from "react";
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
} from "../../components/formik/FormikInputs/FormikInput";
import { showToast } from "../../sweetalert/Sweetalert";
import Spinner from "../../loading/Loading";
import { FaUserEdit } from "react-icons/fa";

type PropsTable = {
  IdDetDirectores: number;
  IDDepartamento: number;
  Nombre_Director: string|null;
  Firma_Director: string | null;
  NombreCompleto?: string  |null;
  Nombre_Departamento:string|null;
};

const ActionButtons = ({
  data,
  handleEdit,
  // mutation,
  // setOpen,
  // handleEdit,
}: {
  data: Record<string, any>;
  // mutation: any;
  // setOpen: Dispatch<SetStateAction<boolean>>;
  // handleEdit: (data: Record<string, any>) => void;
  handleEdit: (provedor: PropsTable) => void;
}) => {
  const handleDelete = () => {
    //   mutation.mutate({
    //     url: `/users/delete/${data.IDUsuario}`,
    //     method: "DELETE",
    //   });
  };

  return (
    <>
      <div className="flex gap-2">
        <Tooltip content="asignar nuevo director">
          <Button
            color="yellow"
            size="small"
            variant="solid"
            onClick={() => {
              handleEdit(data as PropsTable);
            }}
          >
            <FaUserEdit />
          </Button>
        </Tooltip>
        {/* 
          <Tooltip content="eliminar al usuario">
            <Button
              color="red"
              size="small"
              variant="solid"
              onClick={handleDelete}
            >
              <MdDelete />
            </Button>
          </Tooltip> */}
      </div>
    </>
  );
};
const Picture = ({ data }: { data: PropsTable }) => {

  return (
    <PhotoZoom
      src={
      `${import.meta.env.VITE_API_IMG}/${data.Firma_Director}`  
      }
      alt={"Firma del director " + data.Nombre_Director}
      title={data?.Nombre_Director ||''}
    ></PhotoZoom>
  );
};
const CatDepartaments = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [spiner, setSpiner] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<PropsTable>({
    Nombre_Director: null,
    Firma_Director: null,
    IDDepartamento: 0,
    IdDetDirectores: 0,
    NombreCompleto: null,
    Nombre_Departamento:null,
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
  const [departaments, users] = queries;
  const onSubmit = async (values: Record<string, any>) => {
    setSpiner(true)
  
    const formData = new FormData();
    formData.append("IDDepartamento", values.IDDepartamento);
    formData.append("Nombre_Director", values.NombreCompleto);
    formData.append("Firma_Director", values.Firma_Director);
  
  
   try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/departaments/create`, {
        method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${ localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    setSpiner(false)

    const errorData = await response.json().catch(() => ({})); // Si el cuerpo no es JSON
    showToast("no se pudo registrar al director", "error");

    return
  }
  
  const data = await response.json();
  console.log("Respuesta del servidor:", data);
  if (data && data?.message && data?.status) {
      showToast(data?.message, data?.status);
    
  }
  setOpen(false)
  queryClient.refetchQueries({
    queryKey: ["catDepartaments/index"],
  });
  setSpiner(false)

} catch (error) {
  console.error("Error al enviar el formulario:", error);
}

  };
  
  const validationSchema = Yup.object({
    IDDepartamento: Yup.number().min(1,"El departamento es requerido").required("El departamento es requerido"),
    NombreCompleto: Yup.string().required("El director es requerido"),
    Firma_Director: Yup.mixed()
    .required("La firma es obligatoria")
    .test("fileType", "Solo se permiten archivos de imagen", (value) => {
      if (value && value instanceof File) {
        return value.type.startsWith("image/");
      }
      return false;
    })
    .test("fileSize", "El archivo debe tener un tamaño máximo de 2 MB", (value) => {
      if (value && value instanceof File) {
        return value.size <= 2 * 1024 * 1024; // 2MB en bytes
      }
      return true;
    }),
});
const queryClient = useQueryClient(); // Inicializa el query client


  return (
    <div className="container mx-auto shadow-lg p-6 border mt-12">
              {spiner && (<Spinner/>)}

      <div className="ag-theme-alpine w-full mx-auto container p-6">
        <ModalComponent
          open={open}
          // title={`${initialValues?.IDProveedor && initialValues.IDProveedor > 0 ? "Actualizar" : "Registrar"} proveedor`}
          setOpen={() => {
            setOpen(false);
          }}
        >
          <FormikForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            buttonMessage="Registrar"
            onSubmit={onSubmit}
            children={(values,setValue,setTouched,errors) => (
              <>
              <div className="mb-2"></div>

                  <FormikImageInput
                    label="Subir la firma del director"
                    name="Firma_Director"
                    disabled={false}
                    acceptedFileTypes="png,jpg,jpeg"
                  />
                <FormikAutocomplete
                  labelKey="NombreCompleto"
                  idKey="NombreCompleto"
                  label={"Selecciona al nuevo director"}
                  name={"NombreCompleto"}
                  loading={false}
                  options={users.data.data}
                />
                 {errors?.NombreCompleto &&  (
                <span
                  className="text-sm font-semibold text-red-600"
                  id={`${errors?.NombreCompleto}-error`}
                >
                  {errors?.NombreCompleto}
                </span>
              )}
              </>
            )}
          />
        </ModalComponent>
        <Agtable
          permissionsUserTable={{
            buttonElement: "CatDepartamentos",
            table: "CatDepartamentos",
          }}
          loading={departaments.status=="pending"?true:false}
          data={departaments?.data?.data}
          isLoading={departaments.isLoading}
          columnDefs={columnDefs}
          buttonElement={<></>}
          // data={users.data?.data}
        />
      </div>
    </div>
  );
};
export default CatDepartaments;
