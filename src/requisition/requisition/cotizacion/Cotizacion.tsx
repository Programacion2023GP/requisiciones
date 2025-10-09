import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { showConfirmationAlert, showToast } from "../../sweetalert/Sweetalert";
import Spinner from "../../loading/Loading";
import Button from "../../components/form/Button";
import { formatCurrency } from "../../utils/functions";
import Observable from "../../extras/observable";
import { FcMoneyTransfer } from "react-icons/fc";

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
   Centro_Costo:number,
   Nombre_Departamento:string,
   
};
const TablaPresupuestos = ({ ingresos }: { ingresos: any[] }) => {
   return (
      <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200">
         <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-600 text-white">
               <tr>
                  <th className="px-4 py-2 text-left">Partida Específica</th>
                  <th className="px-4 py-2 text-right">Presupuesto Disponible</th>
               </tr>
            </thead>
            <tbody>
               {ingresos.map((it, index) => (
                  <tr
                     key={index}
                     className={
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                     }
                  >
                     <td className="px-4 py-2 font-medium">
                        {it.PartidaEspecifica}
                     </td>
                     <td className="px-4 py-2 text-right">
                        {formatCurrency(it.PresupuestoDisponible, true, true)
                        }
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};
const CotizacionComponent: React.FC<CotizacionType> = ({
   open,
   setOpen,
   setReloadTable,
}) => {
   const IdRequisicion = Observable().ObservableGet(
      "IdRequisicion",
   ) as RequisitionType;
   const [formValues, setFormValues] = useState<Record<string, any>>({});
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [spiner, setSpiner] = useState<boolean>(true);
   const [data, setData] = useState<Array<Record<string, any>>>([]);
   const [ingresos, setIngresos] = useState([])
   const [openPresupuestos, setOpenPresupuestos] = useState<boolean>(false)
   const init = async () => {
      const response = await fetch(`https://predial.gomezpalacio.gob.mx:4433/api/presupuestos/${IdRequisicion.data.Centro_Costo}`)
      const data = await response.json();
      if (response.ok) {
         setIngresos(data)
      }
   }
   useEffect(() => {

      init();
      // return 
   }, [])

   const mutationCotized = useMutation({
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
         setData([]);
         setSpiner(true);
      },
      onSuccess: async (data) => {
         setSpiner(false);

         const productsData = data.data
            .trim()
            .split("\n")
            .map((line) => {
               const obj: Record<string, string> = {};
               line.split("|").forEach((part) => {
                  const [key, value] = part.split(":").map((p) => p.trim());
                  obj[key] = value ?? "";
               });
               return obj;
            });

         let initialFormValues: Record<string, any> = {};

         productsData.forEach((it: any, index) => {
            initialFormValues[`IDRequisicion`] = it.IDRequisicion;
            initialFormValues[`Ejercicio`] = it.Ejercicio;
            initialFormValues[`IDproveedor1`] = Number(it.IDproveedor1);
            initialFormValues[`IDproveedor2`] = Number(it.IDproveedor2);
            initialFormValues[`IDproveedor3`] = Number(it.IDproveedor3);
            initialFormValues[`ObservacionesCot`] = it.ObservacionesCot;

            initialFormValues[`IDDetalle${index + 1}`] = it.IDDetalle;
            [1, 2, 3].forEach((providerNum) => {
               const fieldNumber = index * 3 + providerNum;

               initialFormValues[`PrecioUnitarioSinIva${fieldNumber}`] =
                  it[`PrecioUnitarioSinIva${providerNum}`] || 0;
               initialFormValues[`PorcentajeIVA${fieldNumber}`] =
                  it[`PorcentajeIVA${providerNum}`] || 0;
               initialFormValues[`ImporteIva${fieldNumber}`] =
                  it[`ImporteIva${providerNum}`] || 0;
               initialFormValues[`PrecioUnitarioConIva${fieldNumber}`] =
                  it[`PrecioUnitarioConIva${providerNum}`] || 0;
               initialFormValues[`Retenciones${fieldNumber}`] =
                  it[`Retenciones${providerNum}`] || 0;
            });
         });

         setFormValues(initialFormValues);
         setData(productsData);
      },

      onError: (error: any) => {
         showToast(
            error.response?.data?.message || "Error al realizar la acción",
            "error",
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
         setReloadTable(true);
      },
      onSuccess: (data) => {
         setOpen(false);
         setFormValues({});
         showToast(data.message, data.status);
         setReloadTable(false);
      },
      onError: (error: any) => {
         showToast(
            error.response?.data?.message || "Error al realizar la acción",
            "error",
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
         setOpen(false);
         setFormValues({});
         showToast(data.message, data.status);
      },
      onError: (error: any) => {
         showToast(
            error.response?.data?.message || "Error al realizar la acción",
            "error",
         );
      },
   });

   const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (!formValues.IDproveedor1) {
         newErrors.IDproveedor1 = "Proveedor 1 es requerido";
      }

      data.forEach((_, index) => {
         [1, 2, 3].forEach((offset) => {
            const providerNumber = index * 3 + offset;
            const precioSinIva =
               formValues[`PrecioUnitarioSinIva${providerNumber}`];
            const porcentajeIVA = formValues[`PorcentajeIVA${providerNumber}`];

            if (
               precioSinIva !== null &&
               precioSinIva !== undefined &&
               precioSinIva !== ""
            ) {
               const num = Number(precioSinIva);
               if (isNaN(num)) {
                  newErrors[`PrecioUnitarioSinIva${providerNumber}`] =
                     "Debe ser un número válido";
               } else if (num < 0) {
                  newErrors[`PrecioUnitarioSinIva${providerNumber}`] =
                     "No puede ser negativo";
               }
            }

            if (
               porcentajeIVA !== null &&
               porcentajeIVA !== undefined &&
               porcentajeIVA !== ""
            ) {
               const num = Number(porcentajeIVA);
               if (isNaN(num)) {
                  newErrors[`PorcentajeIVA${providerNumber}`] =
                     "Debe ser un número válido";
               } else if (num < 0) {
                  newErrors[`PorcentajeIVA${providerNumber}`] =
                     "No puede ser negativo";
               } else if (num > 100) {
                  newErrors[`PorcentajeIVA${providerNumber}`] =
                     "No puede ser mayor a 100%";
               }
            }
         });
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) {
         showToast("Por favor corrija los errores en el formulario", "error");
         return;
      }
      
      if (
         formValues.IDproveedor1 &&
         formValues.IDproveedor2 &&
         formValues.IDproveedor3
      ) {
         mutation.mutate({
            url: "/requisicionesdetails/update",
            method: "PUT",
            data: formValues,
         });
      } else {
         console.log("valores",formValues)
         showConfirmationAlert(
            `Advertencia`,
            "¿La cotización no cuenta con los 3 provedores deseas continuar?.",
         ).then((isConfirmed) => {
            if (isConfirmed) {
               mutation.mutate({
                  url: "/requisicionesdetails/update",
                  method: "PUT",
                  data: formValues,
               });
            } else {
               showToast("La acción fue cancelada.", "error");
            }
         });
      }
   };

   const handleInputChange = (name: string, value: any) => {
      setFormValues((prev) => ({
         ...prev,
         [name]: value,
      }));

      // Limpiar error del campo
      if (errors[name]) {
         setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
         });
      }

      // Recalcular IVA si es necesario
      calculateIVA(name, value);
   };

   const calculateIVA = (fieldName: string, fieldValue: any) => {
      const calculateIVAHelper = (
         precioSinIva: number,
         porcentajeIVA: number,
      ) => {
         if (porcentajeIVA > 0) {
            const importeIva = +(precioSinIva * (porcentajeIVA / 100)).toFixed(
               2,
            );
            const precioConIva = +(importeIva + precioSinIva).toFixed(2);
            return { importeIva, precioConIva };
         }
         return { importeIva: 0, precioConIva: precioSinIva };
      };

      data.forEach((_, index) => {
         [1, 2, 3].forEach((offset) => {
            const providerNumber = index * 3 + offset;

            const isPrecioField =
               fieldName === `PrecioUnitarioSinIva${providerNumber}`;
            const isPorcentajeField =
               fieldName === `PorcentajeIVA${providerNumber}`;

            if (isPrecioField || isPorcentajeField) {
               const precioSinIva = isPrecioField
                  ? Number(fieldValue) || 0
                  : Number(
                     formValues[`PrecioUnitarioSinIva${providerNumber}`],
                  ) || 0;

               const porcentajeIVA = isPorcentajeField
                  ? Number(fieldValue) || 0
                  : Number(formValues[`PorcentajeIVA${providerNumber}`]) || 0;

               const { importeIva, precioConIva } = calculateIVAHelper(
                  precioSinIva,
                  porcentajeIVA,
               );

               setFormValues((prev) => ({
                  ...prev,
                  [`ImporteIva${providerNumber}`]: importeIva,
                  [`PrecioUnitarioConIva${providerNumber}`]: precioConIva,
               }));
            }
         });
      });
   };

   useEffect(() => {
      mutationCotized.mutate({
         method: "POST",
         url: "/requisiciones/productsPlainText",
         data: {
            IDRequisicion: IdRequisicion?.data?.IDRequisicion,
            Ejercicio: IdRequisicion?.data?.Ejercicio,
         },
      });
   }, []);

   const renderInput = (name: string, disabled: boolean = false) => (
      <div className="w-full">
         <input
            type="text"
            name={name}
            value={formValues[name] || ""}
            onChange={(e) => handleInputChange(name, e.target.value)}
            disabled={disabled}
            className={`w-full px-2 py-1 text-sm border rounded ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
               } ${errors[name] ? "border-red-500" : "border-gray-300"}`}
         />
         {errors[name] && (
            <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
         )}
      </div>
   );

   const renderSelect = (
      name: string,
      options: any[],
      labelKey: string,
      idKey: string,
   ) => {
      const selectedValue = formValues[name] || "";
      const otherProviders = [
         formValues.IDproveedor1,
         formValues.IDproveedor2,
         formValues.IDproveedor3,
      ].filter((id) => id && id !== selectedValue);

      const filteredOptions = options.filter(
         (opt) => !otherProviders.includes(opt[idKey]),
      );

      return (
         <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">
               {name === "IDproveedor1" && "Proveedor 1"}
               {name === "IDproveedor2" && "Proveedor 2"}
               {name === "IDproveedor3" && "Proveedor 3"}
            </label>
            <select
               name={name}
               value={selectedValue}
               onChange={(e) => handleInputChange(name, Number(e.target.value))}
               className={`w-full px-3 py-2 border rounded ${errors[name] ? "border-red-500" : "border-gray-300"
                  }`}>
               <option value="">Seleccione...</option>
               {filteredOptions.map((opt) => (
                  <option key={opt[idKey]} value={opt[idKey]}>
                     {opt[labelKey]}
                  </option>
               ))}
            </select>
            {errors[name] && (
               <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
            )}
         </div>
      );
   };

   return (
      <ModalComponent
         title="Detalle de Cotizaciones"
         open={open}
         actions={<Button onClick={() => setOpenPresupuestos(true)} color={"blue"} variant={"text"}>
            <FcMoneyTransfer  size={20} />
         </Button>}
         setOpen={() => setOpen(false)}>
         {(suppliers.status === "pending" || spiner) && <Spinner />}
         {openPresupuestos && (
            <ModalComponent fullScreen={false} zIndex={4000} open={openPresupuestos} setOpen={() => setOpenPresupuestos(false)} title={`Presupuestos de ${IdRequisicion.data.Nombre_Departamento}`} children={<TablaPresupuestos ingresos={ingresos}/>} />
         )}


         {Array.isArray(data) && data.length > 0 && (
            <form onSubmit={handleSubmit}>
               <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                  {/* Header informativo */}
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                           <h3 className="text-lg font-semibold text-blue-800">
                              Estado:{" "}
                              {IdRequisicion?.data?.status === "CO"
                                 ? "Cotización"
                                 : "Orden de Compra"}
                           </h3>
                           <p className="text-sm text-blue-600">
                              {IdRequisicion?.data?.status == "CO"
                                 ? ` Complete la información de cotización para los ${data.length} productos`
                                 : "Seleciona al provedor"}
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
                  {IdRequisicion?.data?.status == "CO" && (
                     <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                           Seleccione los 3 Proveedores
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                           {renderSelect(
                              "IDproveedor1",
                              suppliers?.data?.data || [],
                              "NombreCompleto",
                              "IDProveedor",
                           )}
                           {renderSelect(
                              "IDproveedor2",
                              suppliers?.data?.data || [],
                              "NombreCompleto",
                              "IDProveedor",
                           )}
                           {renderSelect(
                              "IDproveedor3",
                              suppliers?.data?.data || [],
                              "NombreCompleto",
                              "IDProveedor",
                           )}
                        </div>
                     </div>
                  )}

                  {/* Tabla estilo Excel */}
                  <div className="overflow-x-auto">
                     <table className="min-w-full text-sm border border-gray-300">
                        <thead className="bg-gray-100">
                           <tr>
                              <th className="px-3 py-2 text-left border">
                                 Producto
                              </th>
                              {[1, 2, 3].map((offset) => (
                                 <th
                                    key={offset}
                                    className="px-3 py-2 text-center border"
                                    colSpan={5}>
                                    {IdRequisicion?.data?.status == "OC" ? (
                                       <Button
                                          color="blue"
                                          variant={
                                             data?.[0]["Proveedor"] ==
                                                formValues[`IDproveedor${offset}`]
                                                ? "solid"
                                                : "outline"
                                          }
                                          onClick={() => {
                                             mutationOC.mutate({
                                                method: "POST",
                                                url: "requisicionesdetails/ordencompra",
                                                data: {
                                                   Ejercicio:
                                                      IdRequisicion?.data
                                                         ?.Ejercicio,
                                                   IDRequisicion:
                                                      IdRequisicion?.data
                                                         ?.IDRequisicion,
                                                   Proveedor:
                                                      formValues[
                                                      `IDproveedor${offset}`
                                                      ],
                                                },
                                             });
                                          }}>
                                          {suppliers?.data?.data.find(
                                             (prov) =>
                                                prov.IDProveedor ==
                                                formValues[
                                                `IDproveedor${offset}`
                                                ],
                                          )?.NombreCompleto ||
                                             `Proveedor ${offset}`}
                                       </Button>
                                    ) : (
                                       suppliers?.data?.data.find(
                                          (prov) =>
                                             prov.IDProveedor ==
                                             formValues[`IDproveedor${offset}`],
                                       )?.NombreCompleto ||
                                       `Proveedor ${offset}`
                                    )}
                                 </th>
                              ))}
                           </tr>
                           <tr>
                              <th className="px-3 py-2 border"></th>
                              {[1, 2, 3].map((offset) => (
                                 <React.Fragment key={offset}>
                                    <th className="px-3 py-2 text-center border">
                                       P.U.
                                    </th>
                                    <th className="px-3 py-2 text-center border">
                                       % IVA
                                    </th>
                                    <th className="px-3 py-2 text-center border">
                                       Ret.
                                    </th>
                                    <th className="px-3 py-2 text-center border">
                                       IVA cal.
                                    </th>
                                    <th className="px-3 py-2 text-center border">
                                       P. c/IVA
                                    </th>
                                 </React.Fragment>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="">
                           {data?.length > 0 &&
                              data.map((item: any, index) => (
                                 <tr
                                    key={index}
                                    className="odd:bg-white even:bg-gray-50">
                                    <td className="px-3 py-2 align-top border">
                                       <div className="font-semibold">
                                          {item.Descripcion}
                                       </div>
                                       {item.Codigo && (
                                          <div className="text-xs text-gray-600">
                                             Código: {item.Codigo}
                                          </div>
                                       )}
                                       {item.Cantidad && (
                                          <div className="text-xs font-bold text-blue-700">
                                             Cantidad: {item.Cantidad}
                                          </div>
                                       )}
                                    </td>

                                    {[1, 2, 3].map((offset) => {
                                       const providerNumber =
                                          index * 3 + offset;
                                       return (
                                          <React.Fragment key={offset}>
                                             <td className="px-2 py-1 border">
                                                {renderInput(
                                                   `PrecioUnitarioSinIva${providerNumber}`,
                                                   IdRequisicion?.data
                                                      ?.status === "OC",
                                                )}
                                             </td>
                                             <td className="px-2 py-1 border">
                                                {renderInput(
                                                   `PorcentajeIVA${providerNumber}`,
                                                   IdRequisicion?.data
                                                      ?.status === "OC",
                                                )}
                                             </td>
                                             <td className="px-2 py-1 border">
                                                {renderInput(
                                                   `Retenciones${providerNumber}`,
                                                   IdRequisicion?.data
                                                      ?.status === "OC",
                                                )}
                                             </td>
                                             <td className="px-2 py-1 border">
                                                {renderInput(
                                                   `ImporteIva${providerNumber}`,
                                                   true,
                                                )}
                                             </td>
                                             <td className="px-2 py-1 border">
                                                {renderInput(
                                                   `PrecioUnitarioConIva${providerNumber}`,
                                                   true,
                                                )}
                                             </td>
                                          </React.Fragment>
                                       );
                                    })}
                                 </tr>
                              ))}
                        </tbody>
                        <tfoot>
                           {/* Totales con leyendas */}
                           {[
                              { key: "subtotal", label: "Subtotal" },
                              { key: "iva", label: "IVA Calculado" },
                              { key: "totalConIva", label: "Total con IVA" },
                              { key: "retencion", label: "Retenciones" },
                              { key: "totalNeto", label: "Total Neto" },
                           ].map((row, i) => (
                              <tr key={i} className="font-medium bg-gray-100">
                                 <td className="px-3 py-2 text-right border">
                                    {row.label}
                                 </td>
                                 {[1, 2, 3].map((providerIdx) => {
                                    let subtotal = 0;
                                    let ivaCalculado = 0;
                                    let totalConIva = 0;
                                    let retencionCalculada = 0;
                                    let totalNeto = 0;

                                    data.forEach((item, index) => {
                                       const providerNumber =
                                          index * 3 + providerIdx;
                                       const cantidad =
                                          Number(item.Cantidad) || 0;
                                       const precioSinIva =
                                          Number(
                                             formValues[
                                             `PrecioUnitarioSinIva${providerNumber}`
                                             ],
                                          ) || 0;
                                       const ivaPct =
                                          Number(
                                             formValues[
                                             `PorcentajeIVA${providerNumber}`
                                             ],
                                          ) || 0;
                                       const ret =
                                          Number(
                                             formValues[
                                             `Retenciones${providerNumber}`
                                             ],
                                          ) || 0;

                                       const st = precioSinIva * cantidad;
                                       const iva = st * (ivaPct / 100);
                                       const tcIva = st + iva;
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
                                          className="px-2 py-1 text-right border">
                                          {formatCurrency(
                                             mapTotals[row.key],
                                             true,
                                             false,
                                             2,
                                          )}
                                       </td>
                                    );
                                 })}
                              </tr>
                           ))}
                        </tfoot>
                     </table>
                  </div>

                  {/* Observaciones */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
                     <label className="block mb-2 text-sm font-medium text-gray-700">
                        Observaciones de la Cotización
                     </label>
                     <textarea
                        name="ObservacionesCot"
                        value={formValues.ObservacionesCot || ""}
                        onChange={(e) =>
                           handleInputChange("ObservacionesCot", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                     />
                  </div>

                  {/* Botón Submit */}
                  {IdRequisicion?.data?.status !== "OC" && (
                     <div className="flex justify-end">
                        <button
                           type="submit"
                           className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                           Guardar las cotizaciones
                        </button>
                     </div>
                  )}
               </div>
            </form>
         )}
      </ModalComponent>
   );
};

export default CotizacionComponent;
