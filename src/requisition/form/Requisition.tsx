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
import { IoMdClose, IoMdCopy } from "react-icons/io";
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

  // Obtener grupo de localStorage
  const rawGroup = localStorage.getItem("group");
  let userGroups: number[] = [];
  try {
    const parsed = JSON.parse(rawGroup || "[]");
    userGroups = Array.isArray(parsed) ? parsed.map(Number) : [Number(parsed)];
  } catch (e) {
    userGroups = [];
  }
  const groupArray = [...userGroups];

  // Queries
  const [groups, types, director, detailstypes] = useQueries({
    queries: [
      { queryKey: ["departamentos/index"], queryFn: () => GetAxios("departamentos/index") },
      { queryKey: ["tipos/index"], queryFn: () => GetAxios("tipos/index") },
      {
        queryKey: ["departaments/director", localStorage.getItem("group")],
        queryFn: () => GetAxios(`departaments/director/${groupArray[0] ?? 0}`),
      },
      { queryKey: ["detailstypes/index"], queryFn: () => GetAxios("detailstypes/index") },
    ],
  });

  const formik = useRef<FormikProps<any>>(null);

  // Schema Yup
  const schema = Yup.object({
    Solicitante: Yup.string().required("El solicitante es requerido"),
    IDDepartamento: Yup.number().min(1, "El departamento es requerido").required(),
    Centro_Costo: Yup.number().min(1, "El centro de costo es requerido").required(),
    IDTipo: Yup.number().min(1, "El tipo es requerido").required(),
    FechaCaptura: Yup.string().required("La fecha es requerida"),
    Observaciones: Yup.string().required("Las observaciones son requeridas"),
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: ({ url, method, data }: any) => AxiosRequest(url, method, data),
    onMutate() {
         // setReloadTable(true);
      },
    onSuccess: (data) => {
      // setReloadTable(false);
      document.querySelector<HTMLElement>("#requisitionrefreshdata")?.click();

      setOpen(false);
      showToast(data.message, data.status);
    },
    onError: (err: any) => {
      showToast(err.response?.data?.message || "Error al guardar", "error");
    },
  });

  // Prefill solicitante
  useEffect(() => {
    const nombre = director.data?.data?.[0]?.Nombre_Director || "";
    if (formik.current?.values["Solicitante"] !== "") return;
    formik.current?.setFieldValue("Solicitante", nombre);
  }, [open, director]);

  // Cargar valores iniciales
  useEffect(() => {
    if (!open || !groups.data?.data) return;

    const edicion = (ObservableGet("FormRequisicion") as any)?.data?.edicion || editData;
    const formRequisicion = (ObservableGet("FormRequisicion") as any)?.data?.data || editData;
   if (edicion) {
      setRegistrar("registrar")
   }
    const departamentoId = groupArray[0] ?? 0;
    const departamento = groups.data.data.find((it: any) => it.IDDepartamento == departamentoId);
    const centroCosto = departamento?.Centro_Costo ?? 0;

    let finalValues: any;

    if (formRequisicion) {
      finalValues = Array.isArray(formRequisicion)
        ? { ...formRequisicion[0] }
        : { ...formRequisicion };

      let productos = Array.isArray(formRequisicion)
        ? formRequisicion.map((item: any) => ({
            Cantidad: item.Cantidad || "",
            Descripcion: item.Descripcion || "",
            IDDetalle: item.IDDetalle || 0,
            image: item.image || null,
          }))
        : formRequisicion.Productos || [];

      if (productos.length < 200) {
        productos = [
          ...productos,
          ...Array.from({ length: 200 - productos.length }, () => ({
            Cantidad: "",
            Descripcion: "",
            image: null,
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
          image: null,
        })),
      };
    }
    setValues(finalValues);
  }, [open, groups.data, editData]);

  // Duplicate
const duplicateRequisition = () => {
  const formValues = formik.current?.values;
  if (!formValues) return;

  // Filtrar solo productos con datos
  const productosLlenos = formValues.Productos.filter(
    (p: any) => p.Descripcion?.trim() !== "" && parseFloat(p.Cantidad || 0) > 0
  );

  const formData = new FormData();
  
  formData.append('Solicitante', formValues.Solicitante);
  formData.append('IDDepartamento', formValues.IDDepartamento.toString());
  formData.append('Centro_Costo', formValues.Centro_Costo.toString());
  formData.append('IDTipo', formValues.IDTipo.toString());
  formData.append('FechaCaptura', formValues.FechaCaptura);
  formData.append('Observaciones', formValues.Observaciones);

  // 🔥 CORRECCIÓN: Usar productosLlenos filtrados
  productosLlenos.forEach((producto: any, index: number) => {
    formData.append(`Productos[${index}][Cantidad]`, producto.Cantidad);
    formData.append(`Productos[${index}][Descripcion]`, producto.Descripcion);
    // No enviar IDDetalle para duplicados
  });


  mutation.mutate({
    method: "POST",
    url: "requisiciones/create",
    data: formData,
  });
};

  // Submit
const handleSubmit = (formValues: any) => {
  // Filtrar solo productos con datos válidos
  const productosLlenos = formValues.Productos.filter(
         (p: any) =>
            p.Descripcion?.trim() !== "" && parseFloat(p.Cantidad || 0) > 0
            || (p.IDDetalle && p.IDDetalle > 0) // <-- enviar también si tienen IDDetalle
      );

  const formData = new FormData();
  
  // Solo agregar IDRequisicion si existe y es mayor a 0
  if (formValues?.IDRequisicion && formValues?.IDRequisicion > 0) {
    formData.append("IDRequisicion", formValues.IDRequisicion);
  }
  
  formData.append("Solicitante", formValues.Solicitante);
  formData.append("IDDepartamento", String(formValues.IDDepartamento));
  formData.append("Centro_Costo", String(formValues.Centro_Costo));
  formData.append("IDTipo", String(formValues.IDTipo));
  formData.append("FechaCaptura", formValues.FechaCaptura);
  formData.append("Observaciones", formValues.Observaciones);

  // 🔥 CORRECCIÓN: Usar productosLlenos en lugar de formValues.Productos
  productosLlenos.forEach((p: any, index: number) => {
    formData.append(`Productos[${index}][Cantidad]`, p.Cantidad);
    formData.append(`Productos[${index}][Descripcion]`, p.Descripcion);
    if (p.IDDetalle && p.IDDetalle > 0) {
      formData.append(`Productos[${index}][IDDetalle]`, p.IDDetalle.toString());
    }
    if (p.image instanceof File) {
      formData.append(`Productos[${index}][image]`, p.image);
    }
  });

  // Para debug - ver qué se está enviando
  console.log('Productos llenos:', productosLlenos);
  console.log('Total productos:', formValues.Productos.length);

  mutation.mutate({
    method: "POST",
    url: "requisiciones/create",
    data: formData,
  });
};

  if (!values) return null;

  const responsive = { "2xl": 6, xl: 6, lg: 6, md: 12, sm: 12 };

  const handleModified = (name: string, value: number | string) => {
    if (name === "IDDepartamento") {
      const departamento = groups.data?.data.find((it: any) => it.IDDepartamento == Number(value));
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
      title={title}
    >
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
              prod.Descripcion?.toLowerCase().includes(search.toLowerCase())
            );

            return (
              <>
                {/* --- DEPARTAMENTOS --- */}
                {localStorage.getItem("role") === "SISTEMAS" ? (
                  <FormikAutocomplete
                    responsive={responsive}
                    loading={groups.isLoading}
                    name="IDDepartamento"
                    label={"Selecciona el departamento"}
                    options={groups.data?.data}
                    idKey={"IDDepartamento"}
                    labelKey={"Nombre_Departamento"}
                    handleModified={handleModified}
                    handleModifiedOptions={{ name: "IDDepartamento" }}
                  />
                ) : (
                  <FormikAutocomplete
                    disabled={userGroups.length === 1}
                    responsive={responsive}
                    loading={groups.isLoading}
                    name="IDDepartamento"
                    label="Selecciona el departamento"
                    options={groups.data?.data?.filter(it =>
                      userGroups.includes(it.IDDepartamento)
                    )}
                    idKey="IDDepartamento"
                    labelKey="Nombre_Departamento"
                    handleModified={handleModified}
                    handleModifiedOptions={{ name: "IDDepartamento" }}
                  />
                )}

                {/* CENTRO DE COSTO */}
                <FormikAutocomplete
                  disabled={localStorage.getItem("role") !== "SISTEMAS"}
                  responsive={responsive}
                  loading={groups.isLoading}
                  name="Centro_Costo"
                  label={"Selecciona el centro de costo"}
                  options={groups.data?.data}
                  idKey={"Centro_Costo"}
                  labelKey={"Centro_Costo"}
                />

                {/* TIPO */}
                <FormikAutocomplete
                  responsive={responsive}
                  id="requisition-type"
                  name="IDTipo"
                  label="Tipo"
                  options={types.data?.data}
                  idKey="IDTipo"
                  labelKey="Descripcion"
                />

                <FormikInput responsive={responsive} name="Solicitante" label="Solicitante" />
                <FormikInput name="FechaCaptura" label="Fecha" type="date" id="requisition-fecha"/>
                <FormikTextArea name="Observaciones" label="Observaciones" id="requisition-observation"/>

                {/* --- PRODUCTOS --- */}
                <div className="mt-6 w-full">
                  <div className="w-full">
                    <h3 className="text-lg font-semibold">Productos</h3>
                    <input
                      type="text"
                      placeholder="Buscar descripción..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border px-3 py-1 w-full my-4 rounded-md text-sm focus:ring focus:ring-blue-200"
                    />
                  </div>

                  <div className="border rounded-md overflow-y-auto max-h-[400px] shadow-sm">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="border p-2 w-12 text-center">#</th>
                          <th className="border p-2 w-28 text-center">Imagen</th>
                          <th className="border p-2 w-28 text-center">Cantidad</th>
                          <th className="border p-2 text-left">Descripción</th>
                          <th className="border p-2 w-14 text-center">Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((prod: any, idx: number) => (
                          <tr key={idx} className="odd:bg-gray-50">
                            {/* Número */}
                            <td className="border text-center text-gray-600 p-1">{idx + 1}</td>

                            {/* image */}
                            <td className="border p-1 text-center">
                              <div className="flex flex-col items-center">
                                {prod.image && (
                                  <img
                                    src={
                                      prod.image instanceof File
                                        ? URL.createObjectURL(prod.image)
                                        : prod.image
                                    }
                                    alt="preview"
                                    className="w-12 h-12 object-cover rounded mb-1 border"
                                  />
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setValue(`Productos[${idx}].image`, file);
                                    }
                                  }}
                                  className="text-xs"
                                />
                              </div>
                            </td>

                            {/* Cantidad */}
                            <td className="border p-1 text-center">
                              <input
                                type="number"
                                name={`Productos[${idx}].Cantidad`}
                                value={prod.Cantidad}
                                onChange={(e) => setValue(`Productos[${idx}].Cantidad`, e.target.value)}
                                className="w-full px-2 py-1 text-center border-none focus:ring-0 focus:outline-none"
                                placeholder="0"
                              />
                            </td>

                            {/* Descripción */}
                            <td className="border p-1">
                              <input
                                type="text"
                                name={`Productos[${idx}].Descripcion`}
                                value={prod.Descripcion}
                                onChange={(e) => setValue(`Productos[${idx}].Descripcion`, e.target.value)}
                                className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none"
                                placeholder="Descripción del producto"
                              />
                            </td>

                            {/* Eliminar */}
                            <td className="border p-1 text-center">
                              <Button
                                onClick={() =>
                                  setValue(`Productos[${idx}]`, {
                                    Cantidad: "",
                                    Descripcion: "",
                                    IDDetalle: prod.IDDetalle || 0,
                                    image: null,
                                  })
                                }
                                color={"red"}
                                variant={"outline"}
                              >
                                <IoMdClose />
                              </Button>
                            </td>
                          </tr>
                        ))}
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
