import React, { useRef, useState, useEffect } from "react";
import ModalComponent from "../../components/modal/Modal";
import {
   FormikInput,
   FormikTextArea,
   FormikAutocomplete,
} from "../../components/formik/FormikInputs/FormikInput";
import FormikForm from "../../components/formik/Formik";
import * as Yup from "yup";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { FormikProps } from "formik";
import Button from "../../components/form/Button";
import Spinner from "../../loading/Loading";
import { showToast } from "../../sweetalert/Sweetalert";
import Observable from "../../extras/observable";
import { IoMdClose } from "react-icons/io";
import Chip from "../../components/chip/Chip";
import { IoMdCopy } from "react-icons/io";
import Tooltip from "../../components/toltip/Toltip";

type PropsRequisition = {
   open: boolean;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
   title: string;
   setReloadTable: React.Dispatch<React.SetStateAction<boolean>>;
   editData?: any;
};

const RequisitionForm: React.FC<PropsRequisition> = ({
   open,
   setOpen,
   title,
   setReloadTable,
   editData,
}) => {
   const { ObservableGet } = Observable();

   const [search, setSearch] = useState("");
   const [registrar, setRegistrar] = useState("");

   const [values, setValues] = useState<any>(null);
   // Obtener el valor de localStorage
   const rawGroup = localStorage.getItem("group");

   // Inicializar array vacío
   let userGroups: number[] = [];

   // Intentar parsear y convertir a números
   try {
      const parsed = JSON.parse(rawGroup || "[]");
      if (Array.isArray(parsed)) {
         userGroups = parsed.map(Number); // Si es array, map a números
      } else {
         userGroups = [Number(parsed)]; // Si es un solo valor, meterlo en array
      }
   } catch (e) {
      userGroups = []; // En caso de error, array vacío
   }

   // Lo mismo puedes usar para groupArray si quieres
   const groupArray = [...userGroups];
   const [groups, types, director, detailstypes] = useQueries({
      queries: [
         {
            queryKey: ["departamentos/index"],
            queryFn: () => GetAxios("departamentos/index"),
         },
         { queryKey: ["tipos/index"], queryFn: () => GetAxios("tipos/index") },
         {
            queryKey: ["departaments/director", localStorage.getItem("group")],
            queryFn: () =>
               GetAxios(`departaments/director/${groupArray[0] ?? 0}`),
         },
         {
            queryKey: ["detailstypes/index"],
            queryFn: () => GetAxios("detailstypes/index"),
            refetchOnWindowFocus: true,
         },
      ],
   });

   useEffect(() => {
      //  console.log(open,director.data.data)
      const nombre = director.data?.data?.[0]?.Nombre_Director || "";
      if (formik.current?.values["Solicitante"] != "") {
         return;
      }
      formik.current?.setFieldValue("Solicitante", nombre);
   }, [open, director]);
   const schema = Yup.object({
      Solicitante: Yup.string().required("El solicitante es requerido"),
      IDDepartamento: Yup.number()
         .min(1, "El departamento es requerido")
         .required(),
      Centro_Costo: Yup.number()
         .min(1, "El centro de costo es requerido")
         .required(),
      IDTipo: Yup.number().min(1, "El tipo es requerido").required(),
      FechaCaptura: Yup.string().required("La fecha es requerida"),
      Observaciones: Yup.string().required("Las observaciones son requeridas"),
   });

   const mutation = useMutation({
      mutationFn: ({ url, method, data }: any) =>
         AxiosRequest(url, method, data),
      onSuccess: (data) => {
         setReloadTable(true);
         setOpen(false);
         showToast(data.message, data.status);
      },
      onError: (err: any) => {
         showToast(err.response?.data?.message || "Error al guardar", "error");
      },
   });

   const formik = useRef<FormikProps<any>>(null);

   // --- Cargar datos al abrir el modal ---
   // --- Valores iniciales simples ---
   useEffect(() => {
      if (!open || !groups.data?.data) return;
      const edicion =
         (ObservableGet("FormRequisicion") as any)?.data?.edicion || editData;

      const formRequisicion =
         (ObservableGet("FormRequisicion") as any)?.data?.data || editData;
      console.log("aqui es ", edicion, formRequisicion);
      const departamentoId = groupArray[0] ?? 0;
      const departamento = groups.data.data.find(
         (it: any) => it.IDDepartamento == departamentoId,
      );
      const centroCosto = departamento?.Centro_Costo ?? 0;

      let finalValues: any;
      if (edicion) {
         setRegistrar(edicion ? "Registrar" : "");
      }
      if (formRequisicion) {
         finalValues = Array.isArray(formRequisicion)
            ? { ...formRequisicion[0] }
            : { ...formRequisicion };

         let productos = Array.isArray(formRequisicion)
            ? formRequisicion.map((item: any) => ({
                 Cantidad: item.Cantidad || "",
                 Descripcion: item.Descripcion || "",
                 IDDetalle: item.IDDetalle || 0,
              }))
            : formRequisicion.Productos || [];

         if (productos.length < 200) {
            productos = [
               ...productos,
               ...Array.from({ length: 200 - productos.length }, () => ({
                  Cantidad: "",
                  Descripcion: "",
               })),
            ];
         }

         finalValues.Productos = productos;
      } else {
         finalValues = {
            Solicitante: "",
            IDDepartamento: departamentoId,
            Centro_Costo: centroCosto,
            IDTipo: 0,
            FechaCaptura: "",
            Observaciones: "",
            Productos: Array.from({ length: 200 }, () => ({
               Cantidad: "",
               Descripcion: "",
            })),
         };
      }

      setValues(finalValues);
   }, [open, groups.data, editData]);

   const duplicateRequisition = () => {
      let formValues = formik.current?.values;
      const productosLlenos = formValues.Productos.filter(
         (p: any) =>
            (p.Descripcion?.trim() !== "" && parseFloat(p.Cantidad || 0) > 0) ||
            (p.IDDetalle && p.IDDetalle > 0), // <-- enviar también si tienen IDDetalle
      );
      delete formValues.IDRequisicion;

      mutation.mutate({
         method: "POST",
         url: "requisiciones/create",
         data: { ...formValues, Productos: productosLlenos },
      });
   };

   const handleSubmit = (formValues: any) => {
      const productosLlenos = formValues.Productos.filter(
         (p: any) =>
            (p.Descripcion?.trim() !== "" && parseFloat(p.Cantidad || 0) > 0) ||
            (p.IDDetalle && p.IDDetalle > 0), // <-- enviar también si tienen IDDetalle
      );

      mutation.mutate({
         method: "POST",
         url: "requisiciones/create",
         data: { ...formValues, Productos: productosLlenos },
      });
   };

   if (!values) return null; // Espera a cargar datos
   const responsive = {
      "2xl": 6,
      xl: 6,
      lg: 6,
      md: 12,
      sm: 12,
   };
   const handleModified = (name: string, value: number | string) => {
      if (name === "IDDepartamento") {
         const departamento = groups.data?.data.find(
            (it: any) => it.IDDepartamento == Number(value),
         );
         const centroCosto = departamento?.Centro_Costo ?? 0;
         formik.current?.setFieldValue("Centro_Costo", centroCosto);
      }
   };
   return (
      <ModalComponent
         open={open}
         actions={
            values?.IDRequisicion && (
               <Tooltip content={"Duplicar requisicion"}>
                  <Button
                     id="requisitionduplicate"
                     onClick={duplicateRequisition}
                     color={"indigo"}
                     variant={"text"}
                     children={<IoMdCopy size={20} />}
                  />
               </Tooltip>
            )
         }
         setOpen={() => setOpen(false)}
         title={title}>
         {mutation.status === "pending" && <Spinner />}
         <div className="p-3">
            <FormikForm
               id="form-requisition"
               ref={formik}
               initialValues={values}
               validationSchema={schema}
               onSubmit={handleSubmit}
               buttonMessage={registrar}
               children={(v, setValue) => {
                  const filteredProducts = v.Productos.filter((prod: any) =>
                     prod.Descripcion?.toLowerCase().includes(
                        search.toLowerCase(),
                     ),
                  );

                  return (
                     <>
                        {localStorage.getItem("role") == "SISTEMAS" ? (
                           <FormikAutocomplete
                              responsive={responsive}
                              loading={groups.isLoading}
                              name="IDDepartamento"
                              label={"selecciona el departamento"}
                              options={groups.data?.data}
                              idKey={"IDDepartamento"}
                              labelKey={"Nombre_Departamento"}
                              handleModified={handleModified}
                              handleModifiedOptions={{
                                 name: "IDDepartamento",
                              }}
                           />
                        ) : (
                           <FormikAutocomplete
                              disabled={userGroups.length === 1}
                              responsive={responsive}
                              loading={groups.isLoading}
                              name="IDDepartamento"
                              label="Selecciona el departamento"
                              options={groups.data?.data?.filter(
                                 (it) => userGroups.includes(it.IDDepartamento), // comparar número con número
                              )}
                              idKey="IDDepartamento"
                              labelKey="Nombre_Departamento"
                              handleModified={handleModified}
                              handleModifiedOptions={{ name: "IDDepartamento" }}
                           />
                        )}

                        <FormikAutocomplete
                           disabled={localStorage.getItem("role") != "SISTEMAS"}
                           responsive={responsive}
                           loading={groups.isLoading}
                           name="Centro_Costo"
                           label={"selecciona el centro de costo"}
                           options={groups.data?.data}
                           idKey={"Centro_Costo"}
                           labelKey={"Centro_Costo"}
                        />
                        <FormikAutocomplete
                           responsive={responsive}
                           id="requisition-type"
                           name="IDTipo"
                           label="Tipo"
                           options={types.data?.data}
                           idKey="IDTipo"
                           labelKey="Descripcion"
                        />

                        <FormikInput
                           responsive={responsive}
                           name="Solicitante"
                           label="Solicitante"
                        />
                        <FormikInput
                           name="FechaCaptura"
                           label="Fecha"
                           type="date"
                           id="requisition-fecha"
                        />
                        <FormikTextArea
                           name="Observaciones"
                           label="Observaciones"
                           id="requisition-observation"
                        />
                        {v.IDTipo > 0 && (
                           <div className="w-full mb-2">
                              <span className="w-full font-semibold text-gray-700">
                                 Estos son los tipos de productos que se pueden
                                 agregar:
                              </span>
                           </div>
                        )}

                        <div
                           id="requisition-informative"
                           className="overflow-y-auto max-h-24">
                           <div className="flex flex-wrap gap-1">
                              {detailstypes?.data?.data
                                 .filter((it) => it.IDTipo === v.IDTipo)
                                 .map((it) => (
                                    <span
                                       key={it.IDDetalleTipo}
                                       className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-800 border border-purple-200 rounded-md shadow-sm bg-gradient-to-r from-purple-100 to-pink-100">
                                       {it.Nombre}
                                    </span>
                                 ))}
                           </div>
                        </div>
                        <div className="w-full mt-6">
                           <div className="w-full ">
                              <h3 className="text-lg font-semibold">
                                 Productos
                              </h3>
                              <input
                                 type="text"
                                 placeholder="Buscar descripción..."
                                 value={search}
                                 onChange={(e) => setSearch(e.target.value)}
                                 className="w-full px-3 py-1 my-4 text-sm border rounded-md focus:ring focus:ring-blue-200"
                              />
                           </div>
                           <div className="border rounded-md overflow-y-auto max-h-[400px] shadow-sm">
                              <table className="w-full text-sm border-collapse">
                                 <thead
                                    id="requisitiontableproducts"
                                    className="sticky top-0 bg-gray-100">
                                    <tr>
                                       <th className="p-2 text-center border w-14">
                                          #
                                       </th>
                                       <th className="p-2 text-center border w-28">
                                          Cantidad
                                       </th>
                                       <th className="p-2 text-left border">
                                          Descripción
                                       </th>
                                       <th className="p-2 text-center border w-14">
                                          Eliminar
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {filteredProducts.map(
                                       (prod: any, idx: number) => (
                                          <tr
                                             key={idx}
                                             className="odd:bg-gray-50">
                                             <td className="p-1 text-center text-gray-600 border">
                                                {idx + 1}
                                             </td>
                                             <td className="p-1 text-center border">
                                                <input
                                                   type="number"
                                                   name={`Productos[${idx}].Cantidad`}
                                                   value={prod.Cantidad}
                                                   onChange={(e) =>
                                                      setValue(
                                                         `Productos[${idx}].Cantidad`,
                                                         e.target.value,
                                                      )
                                                   }
                                                   className="w-full px-2 py-1 text-center border-none focus:ring-0 focus:outline-none"
                                                   placeholder="0"
                                                />
                                             </td>
                                             <td className="p-1 border">
                                                <input
                                                   type="text"
                                                   name={`Productos[${idx}].Descripcion`}
                                                   value={prod.Descripcion}
                                                   onChange={(e) =>
                                                      setValue(
                                                         `Productos[${idx}].Descripcion`,
                                                         e.target.value,
                                                      )
                                                   }
                                                   className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none"
                                                   placeholder="Descripción del producto"
                                                />
                                             </td>
                                             <td className="p-1 text-center border">
                                                <Button
                                                   onClick={() =>
                                                      setValue(
                                                         `Productos[${idx}]`,
                                                         {
                                                            Cantidad: "",
                                                            Descripcion: "",
                                                            IDDetalle:
                                                               prod.IDDetalle ||
                                                               0,
                                                         },
                                                      )
                                                   }
                                                   color={"red"}
                                                   variant={"outline"}>
                                                   <IoMdClose />
                                                </Button>
                                             </td>
                                          </tr>
                                       ),
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </>
                  );
               }}
            />
         </div>
      </ModalComponent>
   );
};

export default RequisitionForm;
