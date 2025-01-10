import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import Typography from "../../components/typografy/Typografy";
import FormikForm from "../../components/formik/Formik";
import * as Yup from "yup";
import CollapseComponent from "../../components/colapse/Colapse";
import {
  FormikAutocomplete,
  FormikInput,
  FormikNumberInput,
  FormikTextArea,
} from "../../components/formik/FormikInputs/FormikInput";
import SwitchComponent from "../../components/switch/Swichcomponent";
import Observable from "../../extras/observable";
import { useMutation } from "@tanstack/react-query";
import { AxiosRequest } from "../../axios/Axios";
import { showToast } from "../../sweetalert/Sweetalert";

type CotizacionType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReloadTable: Dispatch<SetStateAction<boolean>>;
};

type TitlesTitle = {
  "Precio Uni. S/IVA": string;
  "Importe IVA": string;
  PorcentajeIVA: string;
  "Precio Uni. C/IVA": string;
  Retenciones: string;
  "Selecciona el provedor": string;
};

const titlesForm: TitlesTitle = {
  "Selecciona el provedor": "IDproveedor",
  "Precio Uni. S/IVA": "PrecioUnitarioSinIva",
  "Importe IVA": "ImporteIva",
  PorcentajeIVA: "PorcentajeIVA",
  "Precio Uni. C/IVA": "PrecioUnitarioConIva",
  Retenciones: "Retenciones",
};

type SuppliersType = {
  suppliers: Array<Record<string, any>>;
};
type RequisitionType = {
  data: Requisition;
};
type Requisition = {
  data: Array<Record<string, any>>;
  status: "OC" | "CO";
};
const CotizacionComponent: React.FC<CotizacionType> = ({
  open,
  setOpen,
  setReloadTable,
}) => {
  const data = Observable().ObservableGet("suppliersSelect") as SuppliersType;
  const IdRequisicion = Observable().ObservableGet(
    "IdRequisicion"
  ) as RequisitionType;

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
      setReloadTable(false);
    },
    onSuccess: (data) => {
      setReloadTable(true);

      showToast(data.message, data.status);
      if (mutation.status === "success") {
        mutation.reset();
      }
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });
  const initialValues = {
    IDRequisicion: IdRequisicion?.data?.data[0].IDRequisicion,
    Ejercicio: IdRequisicion?.data?.data[0].Ejercicio,

    IDProveedor: null, // Cambiar a null
    IDproveedor1: 0,
    PrecioUnitarioSinIva1: "",
    PorcentajeIVA1: "",
    ImporteIva1: "",
    PrecioUnitarioConIva1: "",
    Retenciones1: "",
    IDproveedor2: 0,
    PrecioUnitarioSinIva2: "",
    PorcentajeIVA2: "",
    ImporteIva2: "",
    PrecioUnitarioConIva2: "",
    Retenciones2: "",
    IDproveedor3: 0,
    PrecioUnitarioSinIva3: "",
    PorcentajeIVA3: "",
    ImporteIva3: "",
    PrecioUnitarioConIva3: "",
    Retenciones3: "",
    ObservacionesCot: "",
  };

  const handleSubmit = (values: any) => {
    mutation.mutate({
      url: "/requisicionesdetails/update",
      method: "PUT",
      data: { ...values, newStatus: IdRequisicion.data.status },
    });
  };

  const validationSchema =
    IdRequisicion.data.status == "CO"
      ? Yup.object({
          // IDProveedor: Yup.number()
          //   .min(1, "Selecciona un provedor")
          //   .required("Selecciona un provedor"), // Asegúrate que IDProveedor pueda ser null
          IDproveedor1: Yup.number().required("El provedor 1 es obligatorio"),
          PrecioUnitarioSinIva1: Yup.number().required(
            "Precio unitario sin iva es obligatorio"
          ),
          // PorcentajeIVA1: Yup.number().required("porcentaje del iva es obligatorio"),
          ImporteIva1: Yup.number().required("Importe iva es obligatorio"),
          PrecioUnitarioConIva1: Yup.number().required(
            "Precio unitario con iva es obligatorio"
          ),
          // Retenciones1: Yup.number().required("Retenciones es obligatorio"),

          IDproveedor2: Yup.number()
            .min(1, "Selecciona un provedor")
            .required("Selecciona un provedor"),
          PrecioUnitarioSinIva2: Yup.number().required(
            "Precio unitario sin iva es obligatorio"
          ),
          // PorcentajeIVA2: Yup.number().required("porcentaje del iva es obligatorio"),
          ImporteIva2: Yup.number().required("Importe iva es obligatorio"),
          PrecioUnitarioConIva2: Yup.number().required(
            "Precio unitario con iva es obligatorio"
          ),
          // Retenciones2: Yup.number().required("Retenciones es obligatorio"),

          IDproveedor3: Yup.number()
            .min(1, "Selecciona un provedor")
            .required("Selecciona un provedor"),
          PrecioUnitarioSinIva3: Yup.number().required(
            "Precio unitario sin iva es obligatorio"
          ),
          // PorcentajeIVA3: Yup.number().required("porcentaje del iva es obligatorio"),
          ImporteIva3: Yup.number().required("Importe iva es obligatorio"),
          PrecioUnitarioConIva3: Yup.number().required(
            "Precio unitario con iva es obligatorio"
          ),

          // Retenciones3: Yup.number().required("Retenciones es obligatorio"),
        })
      : Yup.object({
          IDProveedor: Yup.number()
            .min(1, "Selecciona un provedor")
            .required("Selecciona un provedor"),
        });
  const handleModified = (
    values: Record<string, any>,
    setFieldValue: (name: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const calculateIVA = (precioSinIva: number, porcentajeIVA: number) => {
      // Solo realizar el cálculo si el porcentaje de IVA es mayor que 0
      if (porcentajeIVA > 0) {
        const importeIva = +(precioSinIva * (porcentajeIVA / 100)).toFixed(2); // Convierte a número
        const precioConIva = +(importeIva + precioSinIva).toFixed(2); // Convierte a número
        return { importeIva, precioConIva };
      }
      // Si el IVA no se aplica, devolver 0 para ambos campos
      return { importeIva: 0, precioConIva: precioSinIva }; // Mantener como número
    };

    const { importeIva: importeIva1, precioConIva: precioConIva1 } =
      calculateIVA(
        Number(values.PrecioUnitarioSinIva1),
        Number(values.PorcentajeIVA1)
      );
    setFieldValue("ImporteIva1", importeIva1);
    setFieldValue("PrecioUnitarioConIva1", precioConIva1);

    const { importeIva: importeIva2, precioConIva: precioConIva2 } =
      calculateIVA(
        Number(values.PrecioUnitarioSinIva2),
        Number(values.PorcentajeIVA2)
      );
    setFieldValue("ImporteIva2", importeIva2);
    setFieldValue("PrecioUnitarioConIva2", precioConIva2);

    const { importeIva: importeIva3, precioConIva: precioConIva3 } =
      calculateIVA(
        Number(values.PrecioUnitarioSinIva3),
        Number(values.PorcentajeIVA3)
      );
    setFieldValue("ImporteIva3", importeIva3);
    setFieldValue("PrecioUnitarioConIva3", precioConIva3);
  };

  return (
    <ModalComponent
      title="Detalle de Cotizaciones"
      open={open}
      setOpen={() => setOpen(false)}
    >
      <div className="overflow-x-auto w-full mx-auto mb-8 p-4 bg-gray-50 rounded-lg shadow">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100 text-slate-900">
            <tr>
              <th className="py-3 px-4 text-left font-medium">Descripción</th>
              <th className="py-3 px-4 text-right font-medium">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {IdRequisicion.data.data.map((item: any) => (
              <tr className="hover:bg-gray-100 transition duration-150">
                <td className="border-b border-gray-200 px-4 py-3 text-left text-gray-700">
                  {item.Descripcion}
                </td>
                <td className="border-b border-gray-200 px-4 py-3 text-right text-gray-700">
                  {item.Cantidad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario */}
      <FormikForm
        buttonMessage="Registrar"
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(values, setFieldValue, setTouched, errors) => {
          return (
            <div className="w-full space-y-8 px-2 overflow-auto">
              {[1, 2, 3].map((contProvedor) => (
                <div
                  key={contProvedor}
                  className={`w-full ${
                    values.IDProveedor === contProvedor
                      ? "bg-sky-100"
                      : "bg-gray-50"
                  } p-6 rounded-lg shadow-lg`}
                >
                  <Typography className="mb-4 text-lg font-semibold text-slate-800">
                    Proveedor {contProvedor}
                  </Typography>

                  {IdRequisicion.data.status == "OC" && (
                    <SwitchComponent
                      enabled={values.IDProveedor === contProvedor}
                      label={`Seleccionar al proveedor ${contProvedor}`}
                      enabledColor="bg-sky-200"
                      disabledColor="bg-gray-200"
                      onclick={() => {
                        values.IDProveedor === contProvedor
                          ? setFieldValue("IDProveedor", null)
                          : setFieldValue("IDProveedor", contProvedor);
                      }}
                    />
                  )}
                  {/* {JSON.stringify(errors)} */}
                  {errors?.IDProveedor && (
                    <Typography className="mb-4 text-md font-semibold text-red-500">
                      {errors.IDProveedor}
                    </Typography>
                  )}
                  <div className="w-full">
                    {(Object.keys(titlesForm) as (keyof TitlesTitle)[]).map(
                      (title) => {
                        const fieldName = titlesForm[title] + contProvedor;

                        {
                          if (title === "Selecciona el provedor") {
                            return (
                              <FormikAutocomplete
                                disabled={
                                  IdRequisicion.data.status == "OC"
                                    ? true
                                    : false
                                }
                                label={title}
                                key={title + contProvedor}
                                name={fieldName}
                                options={data?.suppliers ? data?.suppliers : []}
                                labelKey={"NombreCompleto"}
                                idKey={"IDProveedor"}
                                loading={false}
                              />
                            );
                          }

                          return (
                            <FormikInput
                              handleModified={
                                title == "Precio Uni. S/IVA" ||
                                title == "PorcentajeIVA"
                                  ? handleModified
                                  : undefined
                              }
                              disabled={
                                title == "Importe IVA" ||
                                title == "Precio Uni. C/IVA" ||
                                IdRequisicion.data.status == "OC"
                                  ? true
                                  : false
                              }
                              key={title + contProvedor}
                              type={"number"}
                              responsive={{ "2xl": 6, xl: 6 }}
                              name={fieldName}
                              label={title}
                            />
                          );
                        }
                      }
                    )}
                  </div>
                </div>
              ))}
              <div className="overflow-x-auto w-full mx-auto mb-8 p-4 bg-gray-50 rounded-lg shadow">
                <FormikTextArea
                  label="Observaciones de la Cotización"
                  name="ObservacionesCot"
                  disabled={IdRequisicion.data.status == "OC" ? true : false}
                />
              </div>
            </div>
          );
        }}
      </FormikForm>
    </ModalComponent>
  );
};

export default CotizacionComponent;
