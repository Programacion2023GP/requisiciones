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
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { showToast } from "../../sweetalert/Sweetalert";
import Button from "../../components/form/Button";
import { IoMdSend } from "react-icons/io";
import Spinner from "../../loading/Loading";
import { MdCheck } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Tooltip from "../../components/toltip/Toltip";

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
  Ejercicio: number;
  IdRequisicion: number;
  status: "OC" | "CO";
};
const CotizacionComponent: React.FC<CotizacionType> = ({
  open,
  setOpen,
  setReloadTable,
}) => {
  const IdRequisicion = Observable().ObservableGet(
    "IdRequisicion"
  ) as RequisitionType;
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [spiner, setSpiner] = useState<boolean>(true);
  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const mutationSearch = useMutation({
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
      setInitialValues({});
      setSpiner(true);
    },
    onSuccess: (data) => {
      setSpiner(false);
      setInitialValues({ ...data?.data, ObservacionesCot: "" });
      // showToast(data.message, data.status);
      if (mutationSearch.status === "success") {
        mutationSearch.reset();
      }
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });
  const mutationCotized = useMutation({
    mutationFn: ({
      url,
      method,
      data,
    }: {
      url: string;
      method: "POST" | "PUT" | "DELETE";
      data?: any;
    }) => AxiosRequest(url, method, IdRequisicion.data),
    onMutate(variables) {
      setData([]);
      setSpiner(true);
    },
    onSuccess: async (data, variables) => {
      setSpiner(false);
      setData(data.data);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });
  const queries = useQueries({
    queries: [
      {
        queryKey: ["requisitionssuppliers/index"],
        queryFn: () => GetAxios("provedores/index"),
        refetchOnWindowFocus: true,
      },
    ],
  });
  const [suppliers] = queries;
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
      mutationCotized.mutate({
        method: "POST",
        url: "/requisiciones/products",
        data: {
          ...IdRequisicion.data,
        },
      });
      // setReloadTable(true);
      setInitialValues({});
      showToast(data.message, data.status);
      // if (mutation.status === "success") {
      //   mutation.reset();
      // }
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });

  const handleSubmit = (values: any) => {
    mutation.mutate({
      url: "/requisicionesdetails/update",
      method: "PUT",
      data: { ...values, newStatus: IdRequisicion.data.status },
    });
  };

  const validationSchema =
    IdRequisicion?.data?.status == "CO"
      ? Yup.object({
          // Proveedor: Yup.number()
          //   .min(1, "Selecciona un provedor")
          //   .required("Selecciona un provedor"), // Asegúrate que Proveedor pueda ser null
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
          Proveedor: Yup.number()
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
  useEffect(() => {
    mutationCotized.mutate({
      method: "POST",
      url: "/requisiciones/products",
      data: {
        IDRequisicion: IdRequisicion.data.IdRequisicion,
        Ejercicio: IdRequisicion.data.Ejercicio,
      },
    });
  }, []);
  return (
    <ModalComponent
      title="Detalle de Cotizaciones"
      open={open}
      setOpen={() => setOpen(false)}
    >
      {suppliers.status == "pending" || (spiner && <Spinner />)}
      <div className="overflow-x-auto w-full mx-auto mb-8 p-4 bg-gray-50 rounded-lg shadow">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100 text-slate-900">
            <tr>
              <th className="py-3 px-4 text-center font-medium">Descripción</th>
              <th className="py-3 px-4 text-center font-medium">Cantidad</th>
              <th className="py-3 px-4 text-center font-medium">Cotizado</th>
              <th className="py-3 px-4 text-center font-medium">
                Provedor seleccionado
              </th>

              <th className="py-3 px-4 text-center font-medium">Accion</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((item: any) => (
                <tr
                  className={` transition duration-150 ${initialValues?.IDDetalle == item.IDDetalle && "bg-sky-100"}`}
                >
                  <td className="border-b border-gray-200 px-4 py-3 text-center text-gray-700">
                    {/* {item.IDDetalle}   */}
                    {item.Descripcion}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3 text-center text-gray-700">
                    {item.Cantidad}
                  </td>
                  <td className="border-b border-gray-200  px-4 py-3 text-center text-gray-700">
                    <div className="w-full flex justify-center">
                      {item.IDproveedor1 > 0 &&
                      item.IDproveedor2 > 0 &&
                      item.IDproveedor3 > 0 ? (
                        <MdCheck />
                      ) : (
                        <IoClose />
                      )}
                    </div>
                  </td>
                  <td className="border-b border-gray-200  px-4 py-3 text-center text-gray-700">
                    <div className="w-full flex justify-center">
                      {item.Proveedor ? <MdCheck /> : <IoClose />}
                    </div>
                  </td>
                  <td className="border-b border-gray-200 px-4 py-3  text-gray-700 flex justify-center">
                    <div className="w-fit">
                      <Tooltip content="seleccionar">
                        <Button
                          color="blue"
                          variant="solid"
                          size="small"
                          onClick={() => {
                            mutationSearch.mutate({
                              method: "POST",
                              url: "/requisicionesdetails/search",
                              data: { IDDetalle: item.IDDetalle },
                            });
                          }}
                        >
                          <IoMdSend />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {initialValues?.IDDetalle && (
        <FormikForm
          buttonMessage={
            IdRequisicion.data.status == "CO"
              ? "Cotizar"
              : "Seleccionar provedor"
          }
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
      {(values, setFieldValue, setTouched, errors) => {
  return (
    <div className="w-full space-y-8 px-2 overflow-auto">
      {[1, 2, 3].map((contProvedor) => {
        // Clase dinámica de fondo
        const bgClass =
          values.Proveedor === values[`IDproveedor${contProvedor}`] &&
          values[`IDproveedor${contProvedor}`] > 0
            ? "bg-sky-100"
            : "bg-gray-50";

        return (
          <div
            key={contProvedor}
            className={`w-full ${bgClass} p-6 rounded-lg shadow-lg`}
          >
            <Typography className="mb-4 text-lg font-semibold text-slate-800">
              Proveedor {contProvedor}
            </Typography>

            {IdRequisicion.data.status === "OC" && (
              <SwitchComponent
                enabled={values.Proveedor === values[`IDproveedor${contProvedor}`]}
                label={`Seleccionar al proveedor ${contProvedor}`}
                enabledColor="bg-sky-200"
                disabledColor="bg-gray-200"
                onclick={() => {
                  // Alterna el proveedor seleccionado
                  values.Proveedor === values[`IDproveedor${contProvedor}`]
                    ? setFieldValue("Proveedor", null)
                    : setFieldValue(
                        "Proveedor",
                        values[`IDproveedor${contProvedor}`]
                      );
                }}
              />
                      )}
                      {/* {JSON.stringify(errors)} */}
                      {errors?.Proveedor && (
                        <Typography className="mb-4 text-md font-semibold text-red-500">
                          {errors.Proveedor}
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
                                    options={suppliers?.data?.data || []}
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
                  );
                })}
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
      )}
    </ModalComponent>
  );
};

export default CotizacionComponent;
