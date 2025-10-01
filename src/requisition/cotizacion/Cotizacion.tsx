import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import FormikForm from "../../components/formik/Formik";
import * as Yup from "yup";
import {
  FormikAutocomplete,
  FormikInput,
  FormikSwitch,
  FormikTextArea,
} from "../../components/formik/FormikInputs/FormikInput";
import Observable from "../../extras/observable";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { showConfirmationAlert, showToast } from "../../sweetalert/Sweetalert";
import { IoMdSend } from "react-icons/io";
import Spinner from "../../loading/Loading";
import { FormikProps } from "formik";
import { ColComponent, RowComponent } from "../../responsive/Responsive";
import Button from "../../components/form/Button";

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
  IDRequisicion: number;
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
  const [validationSchema, setValidationSchema] = useState<Yup.ObjectSchema<any>>(Yup.object());


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
      console.log("aqui IdRequisicion", IdRequisicion.data)

      let dynamicShape: Record<string, any> = {};
      let dynamicInitialValues: Record<string, any> = {

      };
      let counter = 1;

      // primero tus reglas fijas
      const baseShape: Record<string, any> = {
        IDproveedor1: Yup.number().required("Proveedor 1 requerido"),
        IDproveedor2: Yup.number().nullable(),
        IDproveedor3: Yup.number().nullable(),
        // aquí pones todas las demás fijas que ya tenías
      };

      data.data.forEach((it: any, index) => {
        dynamicInitialValues[`IDRequisicion`] = it.IDRequisicion;
        dynamicInitialValues[`Ejercicio`] = it.Ejercicio;
        dynamicInitialValues[`IDproveedor1`] = Number(it.IDproveedor1);
        dynamicInitialValues[`IDproveedor2`] = Number(it.IDproveedor2);
        dynamicInitialValues[`IDproveedor3`] = Number(it.IDproveedor3);
        dynamicInitialValues[`ObservacionesCot`] = it.ObservacionesCot;

        dynamicInitialValues[`IDDetalle${index + 1}`] = it.IDDetalle;
        [1, 2, 3].forEach((providerNum) => {
          const fieldNumber = (index * 3) + providerNum;

          console.log(`Producto ${index + 1}, Proveedor ${providerNum} → Campo ${fieldNumber}`); // Para debug

          // Cargar valores iniciales desde la base de datos - CORREGIDO
          // Usamos providerNum para leer de la BD y fieldNumber para el nombre del campo
          dynamicInitialValues[`PrecioUnitarioSinIva${fieldNumber}`] = it[`PrecioUnitarioSinIva${providerNum}`] || 0;
          dynamicInitialValues[`PorcentajeIVA${fieldNumber}`] = it[`PorcentajeIVA${providerNum}`] || 0;
          dynamicInitialValues[`ImporteIva${fieldNumber}`] = it[`ImporteIva${providerNum}`] || 0;
          dynamicInitialValues[`PrecioUnitarioConIva${fieldNumber}`] = it[`PrecioUnitarioConIva${providerNum}`] || 0;
          dynamicInitialValues[`Retenciones${fieldNumber}`] = it[`Retenciones${providerNum}`] || 0;
          dynamicShape[`PrecioUnitarioSinIva${counter}`] = Yup.number()
            .nullable()
            .transform((value, originalValue) => {
              // Si está vacío o no es un número válido, retorna null
              if (originalValue === "" || originalValue === null || originalValue === undefined) {
                return null;
              }
              const number = Number(originalValue);
              return isNaN(number) ? originalValue : number; // Mantiene el valor original si no es número
            })
            .typeError("Debe ser un número válido")
            .min(0, "No puede ser negativo");

          dynamicShape[`PorcentajeIVA${counter}`] = Yup.number()
            .nullable()
            .transform((value, originalValue) => {
              if (originalValue === "" || originalValue === null || originalValue === undefined) {
                return null;
              }
              const number = Number(originalValue);
              return isNaN(number) ? originalValue : number;
            })
            .typeError("Debe ser un número válido")
            .min(0, "No puede ser negativo")
            .max(100, "No puede ser mayor a 100%");

          dynamicShape[`ImporteIva${counter}`] = Yup.number()
            .nullable()
            .transform((value, originalValue) => {
              if (originalValue === "" || originalValue === null || originalValue === undefined) {
                return null;
              }
              const number = Number(originalValue);
              return isNaN(number) ? originalValue : number;
            })
            .typeError("Debe ser un número válido")
            .min(0, "No puede ser negativo");

          dynamicShape[`PrecioUnitarioConIva${counter}`] = Yup.number()
            .nullable()
            .transform((value, originalValue) => {
              if (originalValue === "" || originalValue === null || originalValue === undefined) {
                return null;
              }
              const number = Number(originalValue);
              return isNaN(number) ? originalValue : number;
            })
            .typeError("Debe ser un número válido")
            .min(0, "No puede ser negativo");

          dynamicShape[`Retenciones${counter}`] = Yup.number()
            .nullable()
            .transform((value, originalValue) => {
              if (originalValue === "" || originalValue === null || originalValue === undefined) {
                return null;
              }
              const number = Number(originalValue);
              return isNaN(number) ? originalValue : number;
            })
            .typeError("Debe ser un número válido")
            .min(0, "No puede ser negativo");

          counter++;
        });
      });

      console.log("provs", dynamicInitialValues)
      // ahora combinas fijas + dinámicas en un solo schema
      setValidationSchema(
        Yup.object().shape({
          ...baseShape,
          ...dynamicShape,
        })
      );



      setInitialValues(dynamicInitialValues);
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
      // mutationCotized.mutate({
      //   method: "POST",
      //   url: "/requisiciones/products",
      //   data: {
      //     ...IdRequisicion?.data,
      //   },
      // });
      setOpen(false)
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
const mutationOC = useMutation({
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
    
      setOpen(false)
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

    // Crear array de items para enviar



    if (values.IDproveedor1 && values.IDproveedor2 && values.IDproveedor3) {
      mutation.mutate({
        url: "/requisicionesdetails/update",
        method: "PUT",
        data: values,
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
            data: values,
          });
        } else {
          showToast("La acción fue cancelada.", "error");
        }
      });
    }
  };

  // Validación simplificada - solo para los proveedores principales


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

    data.forEach((_, index) => {
      [1, 2, 3].forEach((offset) => {
        const providerNumber = index * 3 + offset;

        const precioSinIva =
          Number(values[`PrecioUnitarioSinIva${providerNumber}`]) || 0;
        const porcentajeIVA =
          Number(values[`PorcentajeIVA${providerNumber}`]) || 0;

        const { importeIva, precioConIva } = calculateIVA(
          precioSinIva,
          porcentajeIVA
        );

        setFieldValue(`ImporteIva${providerNumber}`, importeIva);
        setFieldValue(`PrecioUnitarioConIva${providerNumber}`, precioConIva);
      });
    });
  };


  useEffect(() => {
    mutationCotized.mutate({
      method: "POST",
      url: "/requisiciones/products",
      data: {
        IDRequisicion: IdRequisicion?.data?.IDRequisicion,
        Ejercicio: IdRequisicion?.data?.Ejercicio,
      },
    });
  }, []);

  const ProveedorSection = ({ provedor, providerNumber, values, isOC, index }: any) => (
    <div className={`p-4 rounded-lg border ${index === 1 ? "bg-blue-50 border-blue-200" :
      index === 2 ? "bg-green-50 border-green-200" :
        "bg-purple-50 border-purple-200"
      }`}>
      <h4 className={`font-semibold mb-3 ${index === 1 ? "text-blue-800" :
        index === 2 ? "text-green-800" :
          "text-purple-800"
        }`}>
        {provedor}
      </h4>
      <div className="space-y-3">
        <FormikInput
          responsive={{ "2xl": 4, lg: 6 }}
          label="Precio sin IVA"
          name={`PrecioUnitarioSinIva${providerNumber}`}
          handleModified={handleModified}
          disabled={isOC}
        />
        <FormikInput
          responsive={{ "2xl": 4, lg: 6 }}

          label="% IVA"
          name={`PorcentajeIVA${providerNumber}`}
          handleModified={handleModified}

          disabled={isOC}
        />
        <FormikInput
          responsive={{ "2xl": 4, lg: 6 }}

          label="Retenciones"
          name={`Retenciones${providerNumber}`}

          disabled={isOC}
        />
        <FormikInput
          responsive={{ "2xl": 6, lg: 6 }}

          label="Importe IVA"
          name={`ImporteIva${providerNumber}`}

          disabled
        />
        <FormikInput
          responsive={{ "2xl": 6, lg: 6 }}

          label="Precio con IVA"
          name={`PrecioUnitarioConIva${providerNumber}`}

          disabled
        />
      </div>
    </div>
  );

  return (
    <ModalComponent
      title="Detalle de Cotizaciones"
      open={open}
      setOpen={() => setOpen(false)}
    >
      {(suppliers.status === "pending" || spiner) && <Spinner />}

      {Array.isArray(data) && data.length > 0 && (
        <FormikForm
        
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          buttonMessage= {IdRequisicion.data.status == 'OC' ? "" :"Guardar las cotizaciones"}
          ref={formik}
        >
          {(values, setFieldValue) => (
            <div className="space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Header informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Estado:{" "}
                      {IdRequisicion?.data?.status === "CO"
                        ? "Cotización"
                        : "Orden de Compra"}
                    </h3>

                      <p className="text-sm text-blue-600">
                        {IdRequisicion.data.status == 'CO'?` Complete la información de cotización para los ${data.length}{" "}
                      productos` :"Seleciona al provedor"}
                
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-700">
                      Requisición: {IdRequisicion?.data?.IDRequisicion}
                    </p>
                    <p className="text-sm text-blue-600">
                      Ejercicio: {IdRequisicion?.data?.Ejercicio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selección de Proveedores */}
                { IdRequisicion.data.status == 'CO' && (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Seleccione los 3 Proveedores
                </h3>
             

            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormikAutocomplete
                    label="Proveedor 1"
                    name="IDproveedor1"
                    options={
                      suppliers?.data?.data.filter(
                        (prov: any) =>
                          ![values?.IDproveedor2, values?.IDproveedor3]
                            .filter(Boolean)
                            .includes(prov.IDProveedor)
                      ) || []
                    }
                    labelKey="NombreCompleto"
                    idKey="IDProveedor"
                  />
                  <FormikAutocomplete
                    label="Proveedor 2"
                    name="IDproveedor2"
                    options={
                      suppliers?.data?.data.filter(
                        (prov: any) =>
                          ![values?.IDproveedor1, values?.IDproveedor3]
                            .filter(Boolean)
                            .includes(prov.IDProveedor)
                      ) || []
                    }
                    labelKey="NombreCompleto"
                    idKey="IDProveedor"
                  />
                  <FormikAutocomplete
                    label="Proveedor 3"
                    name="IDproveedor3"
                    options={
                      suppliers?.data?.data.filter(
                        (prov: any) =>
                          ![values?.IDproveedor1, values?.IDproveedor2]
                            .filter(Boolean)
                            .includes(prov.IDProveedor)
                      ) || []
                    }
                    labelKey="NombreCompleto"
                    idKey="IDProveedor"
                  />
                </div>
            </div>
                )}

              {/* Tabla estilo Excel */}
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Producto</th>
                      {[1, 2, 3].map((offset) => (
                        <th

                          key={offset}
                          className="border px-3 py-2 text-center"
                          colSpan={5}
                        >
                          {
                            IdRequisicion.data.status == 'OC' ?
                              <Button color="blue" variant={data?.[0]['Proveedor'] ==values[`IDproveedor${offset}`]?"solid":"outline"} onClick={() => { 
                                console.log("aca",IdRequisicion?.data)
                                mutationOC.mutate({
                                  method:"POST",
                                  url:"requisicionesdetails/ordencompra",
                                  data:{
                                    Ejercicio:IdRequisicion?.data?.Ejercicio,
                             IDRequisicion: IdRequisicion?.data?.IDRequisicion,
                                    Proveedor:values[`IDproveedor${offset}`]

                                  }
                                })

                              }} >{suppliers?.data?.data.find(
                                (prov) =>
                                  prov.IDProveedor ==
                                  values[`IDproveedor${offset}`]
                              )?.NombreCompleto || `Proveedor ${offset}`}</Button>
                              :
                              suppliers?.data?.data.find(
                                (prov) =>
                                  prov.IDProveedor ==
                                  values[`IDproveedor${offset}`]
                              )?.NombreCompleto || `Proveedor ${offset}`
                          }
                        </th>
                      ))}
                    </tr>
                    <tr>
                      <th className="border px-3 py-2"></th>
                      {[1, 2, 3].map((offset) => (
                        <React.Fragment key={offset}>
                          <th className="border px-3 py-2 text-center">
                            Precio sin IVA
                          </th>
                          <th className="border px-3 py-2 text-center">% IVA</th>
                          <th className="border px-3 py-2 text-center">
                            Retenciones
                          </th>
                          <th className="border px-3 py-2 text-center">
                            Importe IVA
                          </th>
                          <th className="border px-3 py-2 text-center">
                            Precio con IVA
                          </th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item: any, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50">
                        <td className="border px-3 py-2 align-top">
                          <div className="font-semibold">{item.Descripcion}</div>
                          {item.Codigo && (
                            <div className="text-xs text-gray-600">Código: {item.Codigo}</div>
                          )}
                          {item.Cantidad && (
                            <div className="text-xs text-blue-700">Cantidad: {item.Cantidad}</div>
                          )}
                        </td>

                        {[1, 2, 3].map((offset) => {
                          const providerNumber = index * 3 + offset;
                          return (
                            <React.Fragment key={offset}>
                              <td className="border px-2 py-1">
                                <FormikInput
                                  label=""
                                  name={`PrecioUnitarioSinIva${providerNumber}`}
                                  handleModified={handleModified}
                                  disabled={IdRequisicion?.data?.status === "OC"}
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <FormikInput
                                  label=""
                                  name={`PorcentajeIVA${providerNumber}`}
                                  handleModified={handleModified}
                                  disabled={IdRequisicion?.data?.status === "OC"}
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <FormikInput
                                  label=""
                                  name={`Retenciones${providerNumber}`}
                                  disabled={IdRequisicion?.data?.status === "OC"}
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <FormikInput label="" name={`ImporteIva${providerNumber}`} disabled />
                              </td>
                              <td className="border px-2 py-1">
                                <FormikInput
                                  label=""
                                  name={`PrecioUnitarioConIva${providerNumber}`}
                                  disabled
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Totales con leyendas */}
                    {[
                      { key: "subtotal", label: "Subtotal" },
                      { key: "iva", label: "IVA Calculado" },
                      { key: "totalConIva", label: "Total con IVA" },
                      { key: "retencion", label: "Retenciones" },
                      { key: "totalNeto", label: "Total Neto" },
                    ].map((row, i) => (
                      <tr key={i} className="bg-gray-100 font-medium">
                        <td className="border px-3 py-2 text-right">{row.label}</td>
                        {[1, 2, 3].map((providerIdx) => {
                          let subtotal = 0;
                          let ivaCalculado = 0;
                          let totalConIva = 0;
                          let retencionCalculada = 0;
                          let totalNeto = 0;

                          data.forEach((item, index) => {
                            const providerNumber = index * 3 + providerIdx;
                            const cantidad = Number(item.Cantidad) || 0;
                            const precioSinIva =
                              Number(values[`PrecioUnitarioSinIva${providerNumber}`]) || 0;
                            const ivaPct =
                              Number(values[`PorcentajeIVA${providerNumber}`]) || 0;
                            const retPct =
                              Number(values[`Retenciones${providerNumber}`]) || 0;

                            const st = precioSinIva * cantidad;
                            const iva = st * (ivaPct / 100);
                            const tcIva = st + iva;
                            const ret = tcIva * (retPct / 100);
                            const neto = tcIva - ret;

                            subtotal += st;
                            ivaCalculado += iva;
                            totalConIva += tcIva;
                            retencionCalculada += ret;
                            totalNeto += neto;
                          });

                          const mapTotals: any = {
                            subtotal,
                            iva: ivaCalculado,
                            totalConIva,
                            retencion: retencionCalculada,
                            totalNeto,
                          };

                          return (
                            <td
                              key={providerIdx}
                              colSpan={5}
                              className="border px-2 py-1 text-right"
                            >
                              {mapTotals[row.key].toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>


                </table>
              </div>

              {/* Observaciones */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <FormikTextArea
                  label="Observaciones de la Cotización"
                  name="ObservacionesCot"
                />
              </div>
            </div>
          )}
        </FormikForm>
      )}
    </ModalComponent>
  );
};

export default CotizacionComponent;