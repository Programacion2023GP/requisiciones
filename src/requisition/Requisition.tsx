import { useState } from "react";
import { ColComponent, RowComponent } from "../responsive/Responsive";
import ModalComponent from "../components/modal/Modal";
import { AxiosRequest, GetAxios } from "../axios/Axios";
import { useMutation, useQueries } from "@tanstack/react-query";
import {
  FormikAutocomplete,
  FormikInput,
  FormikTextArea,
} from "../components/formik/FormikInputs/FormikInput";
import FormikForm from "../components/formik/Formik";
import * as Yup from "yup";
import { showToast } from "../sweetalert/Sweetalert";

const RequisicionesAdd = () => {
  const responsive = {
    "2xl": 6,
    xl: 6,
    lg: 6,
    md: 12,
    sm: 12,
  };
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
    //   queryClient.refetchQueries({
    //     queryKey: ["users/index"],
    //   });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });
  const [open, setOpen] = useState<boolean>(true);
  const queries = useQueries({
    queries: [
      {
        queryKey: ["departamentos/index"],
        queryFn: () => GetAxios("departamentos/index"),
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["tipos/index"],
        queryFn: () => GetAxios("tipos/index"),
        refetchOnWindowFocus: true,
      },
    ],
  });
  const [groups, types] = queries;
  const onSumbit = (values:Record<string,any>)=>{
    // console.log("valores", values);
    // Llamar a la función mutate para ejecutar la solicitud POST
    mutation.mutate({
        url: "/requisiciones/create",
        method: "POST",
        data: values,
  
    });
  };
  const validationSchema = Yup.object({
    Solicitante: Yup.string().required("El solicitante es obligatorio"),
    IDDepartamento: Yup.number()
    .min(1, "El departamento es obligatorio")
    .required("El departamento es obligatorio"),
    IDTipo: Yup.number()
      .min(1, "El tipo  es obligatorio")
      .required("El tipo  es obligatorio"),
  });
  return (
    // <RowComponent>
    //     <ColComponent>
    //     d
    //     </ColComponent>
    // </RowComponent>
    <ModalComponent
      open={open}
      title="Requisicion"
      setOpen={() => {
        setOpen(false);
      }}
    >
      <div className="py-6">
        <FormikForm
          //   ref={formik}
          onSubmit={onSumbit}
          buttonMessage={"Registrar"}
            validationSchema={validationSchema}
          initialValues={{
            IDDepartamento:0,
            Observaciones:"",
            Solicitante:"",
            IDTipo:0,
          }}
          children={(values) => (
            <>
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
                loading={types.isLoading}
                name="IDTipo"
                label={"selecciona el tipo"}
                options={types.data?.data}
                idKey={"IDTipo"}
                labelKey={"Descripcion"}
              />
              <FormikInput
                name="Solicitante"
                label="Solicitante"
              />
              <FormikTextArea
                label="Observaciones"
                name="Observaciones"
              />
            </>
          )}
        />
      </div>
    </ModalComponent>
  );
};
export default RequisicionesAdd;
