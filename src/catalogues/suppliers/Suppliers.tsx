import { useMemo, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import FormikForm from "../../components/formik/Formik";
import * as Yup from "yup";
import { FormikInput } from "../../components/formik/FormikInputs/FormikInput";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { Agtable } from "../../components/table/Agtable";
import { LuPlus } from "react-icons/lu";
import Button from "../../components/form/Button";
import Tooltip from "../../components/toltip/Toltip";
import { ColDef } from "ag-grid-community";
import { ProvedorType } from "./types/TypeSuppliers";
import { BiEdit } from "react-icons/bi";
import { PermissionMenu } from "../../extras/menupermisos";
import { MdDelete } from "react-icons/md";
import { showToast } from "../../sweetalert/Sweetalert";
import CardComponent from "../../components/card/Card";
import Typography from "../../components/typografy/Typografy";
import Spinner from "../../loading/Loading";

const TypeVigencia=({
  data,
  // mutation,
  // setOpen,
  // handleEdit,
}: {
  data: Record<string, any>;
  // mutation: any;
  // setOpen: Dispatch<SetStateAction<boolean>>;
  // handleEdit: (data: Record<string, any>) => void;
})=>{
  return (
    <div className="flex gap-2">
        {data.vigencia}
     

    </div>
  );
}
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
  handleEdit: (provedor: ProvedorType) => void;
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
        <Tooltip content="editar provedor">
          <Button
            color="yellow"
            size="small"
            variant="solid"
            onClick={() => {
              handleEdit(data as ProvedorType);
            }}
          >
            <BiEdit />
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
const SuppliersComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ProvedorType>({
    IDProveedor: 0,
    Nombre_RazonSocial: "",
    ApPaterno: "",
    ApMaterno: "",
    RFC: "",
    Telefono1: "",
    Telefono2: "",
    EMail: "",
  });
  const validationSchema = Yup.object({
    Nombre_RazonSocial: Yup.string()
      .required("El nombre o razón social es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres"),
    ApPaterno: Yup.string()
      .optional()
      .max(50, "Debe tener como máximo 50 caracteres"),
    ApMaterno: Yup.string()
      .optional()
      .max(50, "Debe tener como máximo 50 caracteres"),
    RFC: Yup.string()
      .required("El RFC es obligatorio")
      .matches(
        /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/,
        "Debe ser un RFC válido con formato correcto"
      ),
    Telefono1: Yup.string()
      .required("El teléfono principal es obligatorio")
      .matches(
        /^\d{10}$/,
        "Debe ser un número de teléfono válido de 10 dígitos"
      ),
    Telefono2: Yup.string()
      .optional()
      .matches(
        /^\d{10}$/,
        "Debe ser un número de teléfono válido de 10 dígitos"
      ),
    EMail: Yup.string()
      .required("El correo electrónico es obligatorio")
      .email("Debe ser un correo electrónico válido"),
  });
  const queries = useQueries({
    queries: [
      {
        queryKey: ["suppliers/index"],
        queryFn: () => GetAxios("provedores/index"),
        refetchOnWindowFocus: true,
      },

      // Puedes agregar más peticiones aquí
    ],
  });
  const [suppliers] = queries;
  const handleEdit = (provedor: ProvedorType): void => {
    setInitialValues(provedor);
    setOpen(true);
  };
  const onSubmit = (values: Record<string, any>) => {
    suppliers.refetch();
    mutation.mutate({
      url: `/provedores/create`,
      method: "POST",
      data: values,
    });
  };
  const responsive = {
    "2xl": 6,
    lg: 6,
    md: 12,
    sm: 12,
    xl: 12,
  };
  const buttonElement = useMemo(
    () => (
      <Tooltip content="Agregar Provedor">
        <div className="mb-4">
          <Button
            onClick={() => {
              setInitialValues({
                IDProveedor: 0,
                Nombre_RazonSocial: "",
                ApPaterno: "",
                ApMaterno: "",
                RFC: "",
                Telefono1: "",
                Telefono2: "",
                EMail: "",
              });
              setOpen(true);
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
  const queryClient = useQueryClient(); // Inicializa el query client

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
      console.log(data);
      setOpen(false);
      showToast(data.message, data.status);
      queryClient.refetchQueries({
        queryKey: ["suppliers/index"],
      });
    },
    onError: (error: any) => {
      console.log(error);
      const message =
        error.response?.data?.message || "Error al realizar la acción";
      showToast(message, "error");
    },
  });

  const [columnDefs] = useState<ColDef<ProvedorType>[]>([
    {
      headerName: "Nombre",
      field: "Nombre_RazonSocial",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Apellido Paterno",
      field: "ApPaterno",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Apellido Materno",
      field: "ApMaterno",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Nombre Completo",
      field: "NombreCompleto",
      sortable: true,
      filter: true,
    },

    { headerName: "RFC", field: "RFC", sortable: true, filter: true },
    {
      headerName: "Telefono 1",
      field: "Telefono1",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Telefono 2",
      field: "Telefono2",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Correo electroníco",
      field: "EMail",
      sortable: true,
      filter: true,
    },

    // { headerName: "Rol", field: "Rol", sortable: true, filter: true },
    {
      headerName: "Status",
      field: "vigencia", // Usamos colId para identificar la columna sin usar field
      sortable: true,
      filter: true,

      cellRenderer: (params: any) => <TypeVigencia data={params.data} />, // Usamos cellRendererFramework
    },
    {
      headerName: "Acciones",
      colId: "buttons",
      // field: "Rol", // Usamos colId para identificar la columna sin usar field
      // sortable: true,
      // filter: true,
      cellRenderer: (params: any) => (
        <ActionButtons
          handleEdit={handleEdit}
          data={params.data}
          //   mutation={mutation}
          //   setOpen={setOpen}
          //   handleEdit={handleEdit}
          //   handleEditPermission={handleEditPermission}
          // Assert non-null, but make sure formikRef.current is initialized
        />
      ), // Usamos cellRendererFramework
    },
  ]);
  const getRowClass = (params: {
    node: { rowIndex: number };
    data: Record<string, any>;
  }) => {
    const { vigencia } = params?.data;
    if (vigencia === "Certificado") {
      return "provedor_accepted";
    }
    if (vigencia === "Vencido") {

      return "provedor_canceled";
    }
    if (vigencia === "Nuevo") {

      return "provedor_new";
    }
  };
  return (
    <div className="container mx-auto shadow-lg p-6 border mt-12">
            {mutation.status =='pending' && (<Spinner/>)}

      <div className="ag-theme-alpine w-full mx-auto container p-6">
        <div className="w-full justify-center flex flex-row flex-wrap gap-4 mb-2">
          {[
            { title: "Certificado vencido", bg: "#f8d7da" },
            { title: "Certificado Aprobado", bg: "#d4f4dd" },
            {
              title: "Nuevo provedor",
              bg: "#edff9f",
              tooltip:
                "Solo se le puede comprar una vez hasta que sea registrado en el sistema de provedores con su certificado",
            },
          ].map((item, index) => 
          {
            if (item.tooltip) {
              return (
                <Tooltip content={item.tooltip}>
                  <div
                    key={index}
                    className=" cursor-pointer relative shadow-lg w-64 h-fit p-4 border border-gray-300 rounded-lg"
                  >
                    <div
                      className="flex justify-center items-center h-16 w-full rounded-md"
                      style={{ backgroundColor: item.bg }}
                    >
                      <span className="text-center font-semibold text-gray-800 text-lg">
                        {item.title}
                      </span>
                    </div>
                  
                  </div>
                </Tooltip>
              )
            }
            else{
              return (
                <div
                key={index}
                className="relative shadow-lg w-64 h-fit p-4 border border-gray-300 rounded-lg"
              >
                <div
                  className="flex justify-center items-center h-16 w-full rounded-md"
                  style={{ backgroundColor: item.bg }}
                >
                  <span className="text-center font-semibold text-gray-800 text-lg">
                    {item.title}
                  </span>
                </div>
              
              </div>
              )
            }
          }
          
          )}
        </div>

        <Agtable
          getRowClass={getRowClass}
          permissionsUserTable={{
            buttonElement: "CatProveedores",
            table: "CatProveedores",
          }}
          data={suppliers?.data?.data}
          isLoading={suppliers.isLoading}
          columnDefs={columnDefs}
          buttonElement={buttonElement}
          // data={users.data?.data}
        />
      </div>
      <ModalComponent
        open={open}
        title={`${initialValues?.IDProveedor && initialValues.IDProveedor > 0 ? "Actualizar" : "Registrar"} proveedor`}
        setOpen={() => {
          setOpen(false);
        }}
      >
        <FormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          buttonMessage="Registrar"
          onSubmit={onSubmit}
          children={() => (
            <div className="pt-4">
              <FormikInput
                label="Nombre o Razón Social"
                name="Nombre_RazonSocial"
                responsive={responsive}
              />
              <FormikInput
                label="Ap. Paterno"
                name="ApPaterno"
                responsive={responsive}
              />
              <FormikInput
                label="Ap. Materno"
                name="ApMaterno"
                responsive={responsive}
              />
              <FormikInput
                label="R. F. C."
                name="RFC"
                responsive={responsive}
              />
              <FormikInput
                label="Telefono 1"
                name="Telefono1"
                responsive={responsive}
              />
              <FormikInput
                label="Telefono 2"
                name="Telefono2"
                responsive={responsive}
              />
              <FormikInput
                label="Correo Electronico"
                name="EMail"
                responsive={{ ...responsive, "2xl": 12, lg: 12 }}
              />
            </div>
          )}
        />
      </ModalComponent>
    </div>
  );
};
export default SuppliersComponent;
