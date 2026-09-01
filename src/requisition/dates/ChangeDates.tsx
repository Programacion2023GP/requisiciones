import { useMutation } from "@tanstack/react-query";
import FormikForm from "../../components/formik/Formik"
import { FormikAutocomplete, FormikInput } from "../../components/formik/FormikInputs/FormikInput"
import ModalComponent from "../../components/modal/Modal"
import Observable from "../../extras/observable";
import { Requisition } from "../tracing/Tracing";
import { AxiosRequest } from "../../axios/Axios";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { showToast } from "../../sweetalert/Sweetalert";
import Spinner from "../../loading/Loading";
import * as Yup from "yup";

type DataTracing = {
  data: Requisition;
};


type LineTime = {
    title: string;
    date: string;
    autor: string | null;
};
const ChangeDatesRequisition = ({ open, setOpen, setReloadTable }: {
    open: boolean, setOpen: () => void, setReloadTable: Dispatch<SetStateAction<boolean>>;
}) => {
    const [spiner, setSpiner] = useState<boolean>(false);
        const item = Observable().ObservableGet(
          "RequisitionChangeDates",
        ) as DataTracing;
 const parseDate = (ejercicio?: number) =>
   Yup.date()
     .transform((value, originalValue) => {
       if (Array.isArray(originalValue)) {
         originalValue = originalValue[0];
       }

       if (!originalValue || originalValue === "null") {
         return null;
       }

       const parsed = new Date(originalValue);
       return isNaN(parsed.getTime()) ? null : parsed;
     })
     .nullable()
     .typeError("Formato de fecha inválido")
     .test(
       "year-match",
       `La fecha debe pertenecer al ejercicio ${ejercicio}`,
       function (value) {
         if (!value || !ejercicio) return true;

         return value.getFullYear() === Number(ejercicio);
       },
     );


const safeMin = (field: string, message: string, ejercicio?: number) =>
  parseDate(ejercicio).when(field, (value, schema) => {
    if (!value) return schema;

    const parsed = new Date(Array.isArray(value) ? value[0] : value);

    if (isNaN(parsed.getTime())) return schema;

    return schema.min(parsed, message);
  });
const safeSequentialDate = (
  previousFields: string[],
  immediatePrevious: string | null,
  messageMin: string,
  ejercicio?: number,
) => {
  let schema = parseDate(ejercicio);

  // 🔹 Validar que no saltes pasos
  if (previousFields.length > 0) {
    schema = schema.when(previousFields, (values: any[], s) => {
      const hasFutureValue = values.some((v) => !!v);
      if (hasFutureValue) {
        return s.required(
          "Debe completar las fechas anteriores antes de continuar",
        );
      }
      return s;
    });
  }

  // 🔹 Validar mínimo contra la fecha inmediata anterior
  if (immediatePrevious) {
    schema = schema.when(immediatePrevious, (prevValue: any, s: any) => {
      if (!prevValue) return s;

      const parsed = new Date(
        Array.isArray(prevValue) ? prevValue[0] : prevValue,
      );

      if (isNaN(parsed.getTime())) return s;

      return s.min(parsed, messageMin);
    });
  }

  return schema;
};


const ejercicio = item.data?.Ejercicio ||0;

const fechaCapturaOriginal = item.data?.FechaCapturaOriginal ? new Date(item.data.FechaCapturaOriginal) : null;


const validationSchema = Yup.object().shape({
  FechaCaptura: parseDate(ejercicio)
    .required("La fecha de captura es obligatoria")
    .test(
      "rango-15-dias",
      "La fecha de captura solo puede retroceder hasta 15 días desde su valor original",
      function (value) {
        if (!value || !fechaCapturaOriginal) return true;
        const diffMs = fechaCapturaOriginal.getTime() - value.getTime();
        const diffDias = diffMs / (1000 * 60 * 60 * 24);
        return diffDias >= 0 && diffDias <= 15;
      },
    )
    .test(
      "no-avanzar",
      "La fecha de captura no puede ser mayor a su valor original",
      function (value) {
        if (!value || !fechaCapturaOriginal) return true;
        return value <= fechaCapturaOriginal;
      },
    ),

  FechaAutorizacion: parseDate(ejercicio).test(
    "valid-autorizacion",
    "No puede ser menor a la fecha de captura",
    function (value) {
      const { FechaCaptura } = this.parent;

      if (!value) return true;
      if (!FechaCaptura) return true;

      return new Date(value) >= new Date(FechaCaptura);
    },
  ),

  FechaAsignacion: parseDate(ejercicio).test(
    "valid-asignacion",
    "No puede ser menor a la fecha de autorización",
    function (value) {
      const { FechaAutorizacion } = this.parent;

      if (!value) return true;
      if (!FechaAutorizacion) return true;

      return new Date(value) >= new Date(FechaAutorizacion);
    },
  ),

  FechaCotizacion: parseDate(ejercicio).test(
    "valid-cotizacion",
    "No puede ser menor a la fecha de asignación",
    function (value) {
      const { FechaAsignacion } = this.parent;

      if (!value) return true;
      if (!FechaAsignacion) return true;

      return new Date(value) >= new Date(FechaAsignacion);
    },
  ),

  FechaOrdenCompra: parseDate(ejercicio).test(
    "valid-orden",
    "No puede ser menor a la fecha de cotización",
    function (value) {
      const { FechaCotizacion } = this.parent;

      if (!value) return true;
      if (!FechaCotizacion) return true;

      return new Date(value) >= new Date(FechaCotizacion);
    },
  ),
});


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
        onMutate(variables) {
            setSpiner(true);
            setReloadTable(false);
        },
        onSuccess: (data) => {
            setReloadTable(true);
            setSpiner(false);

            showToast(data.message, data.status);
            if (mutation.status === "success") {
                mutation.reset();
            }
        },
        onError: (error: any) => {
            showToast(
                error.response?.data?.message || "Error al realizar la acción",
                "error",
            );
        },
    });

    
    return (
      <>
        {spiner && <Spinner />}

        <ModalComponent
          title={`Cambio de Fechas`}
          open={open}
          setOpen={setOpen}
        >
          <FormikForm
            validationSchema={validationSchema} // ✅ Validaciones activadas
            initialValues={{
              id: item.data?.Id,
              FechaCaptura: item.data?.FechaCaptura,
              FechaAutorizacion: item.data?.FechaAutorizacion,
              FechaAsignacion: item.data?.FechaAsignacion,
              FechaCotizacion: item.data?.FechaCotizacion,
              FechaOrdenCompra: item.data?.FechaOrdenCompra,

              //   status: item.data?.data?.Status,
              //   id: item.data?.data?.Id,
            }}
            onSubmit={(values) => {
              mutation.mutate({
                method: "POST",
                url: "/requisiciones/changedates",
                data: values,
              });
            }}
            buttonMessage="Cambiar"
            children={() => (
              <div className="w-full mt-8">
                <FormikInput
                  label={"Fecha de Captura"}
                  name={"FechaCaptura"}
                  type="datetime-local"
                />
                <FormikInput
                  label={"Fecha de Autorización"}
                  name={"FechaAutorizacion"}
                  type="datetime-local"
                />

                <FormikInput
                  label={"Fecha de Asignación"}
                  name={"FechaAsignacion"}
                  type="datetime-local"
                />
                <FormikInput
                  label={"Fecha de Cotización"}
                  name={"FechaCotizacion"}
                  type="datetime-local"
                />
                <FormikInput
                  label={"Fecha de orden de compra"}
                  name={"FechaOrdenCompra"}
                  type="datetime-local"
                />
              </div>
            )}
          />
        </ModalComponent>
      </>
    );
}

export default ChangeDatesRequisition;