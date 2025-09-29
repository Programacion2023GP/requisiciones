import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import Typography from "../../components/typografy/Typografy";
import FormikForm from "../../components/formik/Formik";
import * as Yup from "yup";
import {
  FormikAutocomplete,
  FormikInput,
  FormikTextArea,
} from "../../components/formik/FormikInputs/FormikInput";
import SwitchComponent from "../../components/switch/Swichcomponent";
import Observable from "../../extras/observable";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { showConfirmationAlert, showToast } from "../../sweetalert/Sweetalert";
import Button from "../../components/form/Button";
import { IoMdSend } from "react-icons/io";
import Spinner from "../../loading/Loading";
import { MdCheck } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Tooltip from "../../components/toltip/Toltip";
import { FormikProps } from "formik";

type CotizacionType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReloadTable: Dispatch<SetStateAction<boolean>>;
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
  const formik = useRef<FormikProps<Record<string, any>> | null>(null);

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
    onMutate() {
      setInitialValues({});
      setSpiner(true);
    },
    onSuccess: (resp) => {
      setSpiner(false);

      const raw = resp?.data || {};
      const parsed: Record<string, any> = { ...raw };

      Object.keys(raw).forEach((key) => {
        if (
          key.match(
            /(PrecioUnitarioSinIva|PorcentajeIVA|ImporteIva|PrecioUnitarioConIva|Retenciones)\d?$/
          ) &&
          raw[key] !== null
        ) {
          parsed[key] = Number(raw[key]);
        }
      });
      setInitialValues(parsed);
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
    }) => AxiosRequest(url, method, IdRequisicion?.data),
    onMutate() {
      setData([]);
      setSpiner(true);
    },
    onSuccess: async (data) => {
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
    onMutate() {
      setSpiner(true);
      setReloadTable(false);
    },
    onSuccess: (data) => {
      mutationCotized.mutate({
        method: "POST",
        url: "/requisiciones/products",
        data: {
          ...IdRequisicion?.data,
        },
      });
      setInitialValues({});
      showToast(data.message, data.status);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });

  const handleSubmit = (values: any) => {
    if (
      values.IDproveedor1 &&
      values.IDproveedor2 &&
      values.IDproveedor3
    ) {
      mutation.mutate({
        url: "/requisicionesdetails/update",
        method: "PUT",
        data: { ...values, newStatus: IdRequisicion?.data?.status },
      });
    } else {
      showConfirmationAlert(
        `Advertencia`,
        "¿La cotización no cuenta con los 3 provedores deseas continuar?."
      ).then((isConfirmed) => {
        if (isConfirmed) {
          mutation.mutate({
            url: "/requisicionesdetails/update",
            method: "PUT",
            data: { ...values, newStatus: IdRequisicion?.data?.status },
          });
        } else {
          showToast("La acción fue cancelada.", "error");
        }
      });
    }
  };

  const validationSchema =
    IdRequisicion?.data?.status == "CO"
      ? Yup.object({
          IDproveedor1: Yup.number()
            .test(
              "unique1",
              "El proveedor ya está seleccionado en los demás proveedores",
              function (value) {
                const { IDproveedor2, IDproveedor3 } = this.parent;
                return value !== IDproveedor2 && value !== IDproveedor3;
              }
            )
            .required("El proveedor 1 es obligatorio"),
          IDproveedor2: Yup.number()
            .nullable()
            .test(
              "unique2",
              "El proveedor ya está seleccionado en los demás proveedores",
              function (value) {
                const { IDproveedor1, IDproveedor3 } = this.parent;
                return value !== IDproveedor1 && value !== IDproveedor3;
              }
            ),
          IDproveedor3: Yup.number()
            .nullable()
            .test(
              "unique3",
              "El proveedor ya está seleccionado en los demás proveedores",
              function (value) {
                const { IDproveedor1, IDproveedor2 } = this.parent;
                return value !== IDproveedor1 && value !== IDproveedor2;
              }
            ),
          PrecioUnitarioSinIva1: Yup.number().required(
            "Precio unitario sin IVA es obligatorio"
          ),
          ImporteIva1: Yup.number().required("Importe IVA es obligatorio"),
          PrecioUnitarioConIva1: Yup.number().required(
            "Precio con IVA es obligatorio"
          ),
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
      if (porcentajeIVA > 0) {
        const importeIva = +(precioSinIva * (porcentajeIVA / 100)).toFixed(2);
        const precioConIva = +(importeIva + precioSinIva).toFixed(2);
        return { importeIva, precioConIva };
      }
      return { importeIva: 0, precioConIva: precioSinIva };
    };

    [1, 2, 3].forEach((i) => {
      const { importeIva, precioConIva } = calculateIVA(
        Number(values[`PrecioUnitarioSinIva${i}`]),
        Number(values[`PorcentajeIVA${i}`])
      );
      setFieldValue(`ImporteIva${i}`, importeIva);
      setFieldValue(`PrecioUnitarioConIva${i}`, precioConIva);
    });
  };

  useEffect(() => {
    mutationCotized.mutate({
      method: "POST",
      url: "/requisiciones/products",
      data: {
        IDRequisicion: IdRequisicion?.data?.IdRequisicion,
        Ejercicio: IdRequisicion?.data?.Ejercicio,
      },
    });
  }, []);

  return (
    <ModalComponent
      title="Detalle de Cotizaciones"
      open={open}
      setOpen={() => setOpen(false)}
    >
      {(suppliers.status == "pending" || spiner) && <Spinner />}

      {/* tabla resumen */}
      <div className="overflow-x-auto w-full mx-auto mb-8 p-4 bg-gray-50 rounded-lg shadow">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100 text-slate-900">
            <tr>
              <th className="py-3 px-4 text-center font-medium">Descripción</th>
              <th className="py-3 px-4 text-center font-medium">Cantidad</th>
              <th className="py-3 px-4 text-center font-medium">Cotizado</th>
              <th className="py-3 px-4 text-center font-medium">
                Proveedor seleccionado
              </th>
              <th className="py-3 px-4 text-center font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((item: any) => (
                <tr
                  key={item.IDDetalle}
                  className={`transition duration-150 ${
                    initialValues?.IDDetalle == item.IDDetalle && "bg-sky-100"
                  }`}
                >
                  <td className="border-b px-4 py-3 text-center">
                    {item.Descripcion}
                  </td>
                  <td className="border-b px-4 py-3 text-center">
                    {item.Cantidad}
                  </td>
                  <td className="border-b px-4 py-3 text-center">
                    {item.IDproveedor1 > 0 ? <MdCheck /> : <IoClose />}
                  </td>
                  <td className="border-b px-4 py-3 text-center">
                    {item.Proveedor ? <MdCheck /> : <IoClose />}
                  </td>
                  <td className="border-b px-4 py-3 text-center">
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* formulario tipo Excel */}
      {initialValues?.IDDetalle && (
        <FormikForm
          buttonMessage={
            IdRequisicion?.data?.status == "CO"
              ? "Cotizar"
              : "Seleccionar proveedor"
          }
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          ref={formik}
        >
          {(values, setFieldValue) => (
            <div className="space-y-6">
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-100 text-slate-900">
                    <tr>
                      <th className="py-2 px-4">#</th>
                      <th className="py-2 px-4">Proveedor</th>
                      <th className="py-2 px-4">Precio S/IVA</th>
                      <th className="py-2 px-4">% IVA</th>
                      <th className="py-2 px-4">Importe IVA</th>
                      <th className="py-2 px-4">Precio C/IVA</th>
                      <th className="py-2 px-4">Retenciones</th>
                      {IdRequisicion?.data?.status === "OC" && (
                        <th className="py-2 px-4">Seleccionar</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-2 text-center">{i}</td>
                        <td className="px-4 py-2">
                          <FormikAutocomplete 
                            disabled={IdRequisicion?.data?.status == "OC"}
                            name={`IDproveedor${i}`}
                            label=""
                            options={
                              suppliers?.data?.data.filter(
                                (prov: Record<string, any>) =>
                                  ![
                                    values.IDproveedor1,
                                    values.IDproveedor2,
                                    values.IDproveedor3,
                                  ]
                                    .filter(Boolean)
                                    .includes(prov.IDProveedor)
                              ) || []
                            }
                            labelKey="NombreCompleto"
                            idKey="IDProveedor"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormikInput
                            type="number"
                            name={`PrecioUnitarioSinIva${i}`}
                            label=""
                            handleModified={handleModified}
                            disabled={IdRequisicion?.data?.status == "OC"}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormikInput
                            type="number"
                            name={`PorcentajeIVA${i}`}
                            label=""
                            handleModified={handleModified}
                            disabled={IdRequisicion?.data?.status == "OC"}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormikInput
                            type="number"
                            name={`ImporteIva${i}`}
                            label=""
                            disabled
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormikInput
                            type="number"
                            name={`PrecioUnitarioConIva${i}`}
                            label=""
                            disabled
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormikInput
                            type="number"
                            name={`Retenciones${i}`}
                            label=""
                            disabled={IdRequisicion?.data?.status == "OC"}
                          />
                        </td>
                        {IdRequisicion?.data?.status === "OC" && (
                          <td className="px-4 py-2 text-center">
                            <SwitchComponent
                            
                              enabled={
                                values.Proveedor === values[`IDproveedor${i}`]
                              }
                              label=""
                              onclick={() => {
                                values.Proveedor === values[`IDproveedor${i}`]
                                  ? setFieldValue("Proveedor", null)
                                  : setFieldValue(
                                      "Proveedor",
                                      values[`IDproveedor${i}`]
                                    );
                              }}
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <FormikTextArea
                label="Observaciones de la Cotización"
                name="ObservacionesCot"
                disabled={IdRequisicion?.data?.status == "OC"}
              />
            </div>
          )}
        </FormikForm>
      )}
    </ModalComponent>
  );
};

export default CotizacionComponent;
