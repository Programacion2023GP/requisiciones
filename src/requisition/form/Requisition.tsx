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
import { showConfirmationAlert, showToast } from "../../sweetalert/Sweetalert";
import Observable from "../../extras/observable";
import { IoMdClose, IoMdCopy } from "react-icons/io";
import Tooltip from "../../components/toltip/Toltip";
import PhotoZoom from "../../components/images/Images";
import { formatDatetimeToSQL } from "../../utils/functions";

type PropsRequisition = {
   open: boolean;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
   title: string;
   setReloadTable: React.Dispatch<React.SetStateAction<boolean>>;
   editData?: any;
};
// Agrega esta función dentro del componente, antes del return
const compressImageToTarget = (file: File, targetSizeKB: number = 2): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Empezamos con calidad alta y vamos bajando hasta llegar al target
        let quality = 0.7;
        let maxWidth = 800;
        let maxHeight = 800;
        let blob: Blob | null = null;
        
        const tryCompress = () => {
          const canvas = document.createElement('canvas');
          canvas.width = maxWidth;
          canvas.height = maxHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('No se pudo obtener contexto del canvas'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
          
          canvas.toBlob(
            (b) => {
              if (!b) {
                reject(new Error('No se pudo crear el blob'));
                return;
              }
              
              const sizeKB = b.size / 1024;
              console.log(`📊 Intento: calidad=${quality}, tamaño=${sizeKB.toFixed(2)}KB, dim=${maxWidth}x${maxHeight}`);
              
              // Si ya estamos en menos de 2KB, resolvemos
              if (sizeKB <= targetSizeKB) {
                const compressedFile = new File([b], file.name, { type: 'image/jpeg' });
                resolve(compressedFile);
                return;
              }
              
              // Si la imagen aún pesa mucho, reducimos calidad y/o dimensiones
              if (sizeKB > targetSizeKB * 2 && maxWidth > 100) {
                // Reducir dimensiones
                maxWidth = Math.floor(maxWidth * 0.7);
                maxHeight = Math.floor(maxHeight * 0.7);
                quality = Math.max(0.3, quality * 0.8);
                tryCompress();
              } else if (quality > 0.2) {
                // Reducir calidad
                quality = Math.max(0.1, quality * 0.6);
                tryCompress();
              } else {
                // Último recurso: forzar a 100x100
                maxWidth = 100;
                maxHeight = 100;
                quality = 0.1;
                tryCompress();
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        tryCompress();
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
      {
        queryKey: ["departamentos/index"],
        queryFn: () => GetAxios("departamentos/index"),
      },
      { queryKey: ["tipos/index"], queryFn: () => GetAxios("tipos/index") },
      {
        queryKey: ["departaments/director", localStorage.getItem("group")],
        queryFn: () => GetAxios(`departaments/director/${groupArray[0] ?? 0}`),
      },
      {
        queryKey: ["detailstypes/index"],
        queryFn: () => GetAxios("detailstypes/index"),
      },
    ],
  });

  const formik = useRef<FormikProps<any>>(null);

  // Schema Yup
  const schema = Yup.object({
    Solicitante: Yup.string().required("El solicitante es requerido"),
    IDDepartamento: Yup.number()
      .min(1, "El departamento es requerido")
      .required(),
    Centro_Costo: Yup.number()
      .min(1, "El centro de costo es requerido")
      .required(),
    IDTipo: Yup.number().min(1, "El tipo es requerido").required(),
    // FechaCaptura: Yup.string().required("La fecha es requerida"),
    Observaciones: Yup.string().required("Las descripción es requerida"),
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

    const edicion =
      (ObservableGet("FormRequisicion") as any)?.data?.edicion || editData;
    const formRequisicion =
      (ObservableGet("FormRequisicion") as any)?.data?.data || editData;
    if (edicion) {
      setRegistrar("registrar");
    }
    const departamentoId = groupArray[0] ?? 0;
    const departamento = groups.data.data.find(
      (it: any) => it.IDDepartamento == departamentoId,
    );
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
        FechaCaptura: formatDatetimeToSQL(new Date(), "mysql"),
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
      (p: any) =>
        p.Descripcion?.trim() !== "" && parseFloat(p.Cantidad || 0) > 0,
    );

    const formData = new FormData();

    formData.append("Solicitante", formValues.Solicitante);
    formData.append("IDDepartamento", formValues.IDDepartamento.toString());
    formData.append("Centro_Costo", formValues.Centro_Costo.toString());
    formData.append("IDTipo", formValues.IDTipo.toString());
    formData.append("FechaCaptura", formValues.FechaCaptura);
    formData.append("Observaciones", formValues.Observaciones);

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
        (p.Descripcion?.trim() !== "" && parseFloat(p.Cantidad || 0) > 0) ||
        (p.IDDetalle && p.IDDetalle > 0), // <-- enviar también si tienen IDDetalle
    );

    const formData = new FormData();
    // Solo agregar IDRequisicion si existe y es mayor a 0
    if (formValues?.IDRequisicion && formValues?.IDRequisicion > 0) {
      formData.append("Id", formValues.Id);

      formData.append("IDRequisicion", formValues.IDRequisicion);
    }

    formData.append("Solicitante", formValues.Solicitante);
    formData.append("IDDepartamento", String(formValues.IDDepartamento));
    formData.append("Centro_Costo", String(formValues.Centro_Costo));
    formData.append("IDTipo", String(formValues.IDTipo));
    formData.append("FechaCaptura", formatDatetimeToSQL(new Date(), "mysql"));
    formData.append("Observaciones", formValues.Observaciones);

    // 🔥 CORRECCIÓN: Usar productosLlenos en lugar de formValues.Productos
    productosLlenos.forEach((p: any, index: number) => {
      formData.append(`Productos[${index}][Cantidad]`, p.Cantidad);
      formData.append(`Productos[${index}][Descripcion]`, p.Descripcion);
      if (p.IDDetalle && p.IDDetalle > 0) {
        formData.append(
          `Productos[${index}][IDDetalle]`,
          p.IDDetalle.toString(),
        );
      }
      if (p.image instanceof File) {
        formData.append(`Productos[${index}][image]`, p.image);
      }
    });

    // Para debug - ver qué se está enviando
    console.log("Productos llenos:", productosLlenos);
    console.log("Total productos:", formValues.Productos.length);

    if (productosLlenos.length < 1)
      return showConfirmationAlert(
        "FALTA INFORMACIÓN",
        "Es necesario agregar mínimo un producto en el listado.",
        "center",
      ).then((isConfirmed) => {
        if (isConfirmed) {
        } else {
        }
      });

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
      const departamento = groups.data?.data.find(
        (it: any) => it.IDDepartamento == Number(value),
      );
      const centroCosto = departamento?.Centro_Costo ?? 0;
      formik.current?.setFieldValue("Centro_Costo", centroCosto);
    }
  };
  // Helper para detectar tipo de archivo por extensión o MIME
  const getFileType = (file: any): "image" | "pdf" | "other" => {
    if (!file) return "other";

    // Si es un File de JavaScript
    if (file instanceof File) {
      const type = file.type;
      if (type.startsWith("image/")) return "image";
      if (type === "application/pdf") return "pdf";
      return "other";
    }

    // Si es una URL (string)
    if (typeof file === "string") {
      const ext = file.split(".").pop()?.toLowerCase() || "";
      if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext))
        return "image";
      if (ext === "pdf") return "pdf";
      return "other";
    }

    return "other";
  };

  // Componente para mostrar archivos
  const FilePreview: React.FC<{ file: any; alt?: string }> = ({
    file,
    alt = "Archivo",
  }) => {
    const fileType = getFileType(file);

    // Si es imagen, usar PhotoZoom
    if (fileType === "image") {
      const src = file instanceof File ? URL.createObjectURL(file) : file;
      return <PhotoZoom src={src} alt={alt} title={alt} />;
    }

    // Si es PDF
    if (fileType === "pdf") {
      const url = file instanceof File ? URL.createObjectURL(file) : file;
      return (
        <div className="flex flex-col items-center gap-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 text-red-600 transition-all bg-red-100 rounded-lg hover:bg-red-200 hover:scale-105"
            title="Abrir PDF"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
              <path d="M10 9a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" />
              <path d="M10 6a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </a>
          <span className="text-[10px] text-gray-500">PDF</span>
        </div>
      );
    }

    // Otros archivos (Word, Excel, etc.)
    const url = file instanceof File ? URL.createObjectURL(file) : file;
    return (
      <div className="flex flex-col items-center gap-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 text-blue-600 transition-all bg-blue-100 rounded-lg hover:bg-blue-200 hover:scale-105"
          title="Abrir archivo"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <span className="text-[10px] text-gray-500">Archivo</span>
      </div>
    );
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
              prod.Descripcion?.toLowerCase().includes(search.toLowerCase()),
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
                    options={groups.data?.data?.filter((it) =>
                      userGroups.includes(it.IDDepartamento),
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

                <FormikInput
                  responsive={responsive}
                  name="Solicitante"
                  label="Solicitante"
                />
                {localStorage.getItem("role") === "SISTEMAS" ||
                  (localStorage.getItem("role") === "DIRECTORCOMPRAS" && (
                    <FormikInput
                      name="FechaCaptura"
                      label="Fecha"
                      type="date"
                      id="requisition-fecha"
                      //   hidden={true}
                    />
                  ))}
                {v.IDTipo > 0 && (
                  <div className="w-full mb-2">
                    <span className="w-full font-semibold text-gray-700">
                      Estos son los tipos de productos que se pueden agregar:
                    </span>

                    <div
                      id="requisition-informative"
                      className="mt-1 overflow-y-auto max-h-24"
                    >
                      <div className="flex flex-wrap gap-1">
                        {detailstypes?.data?.data
                          ?.filter((it) => it.IDTipo === v.IDTipo)
                          ?.map((it) => (
                            <span
                              key={it.IDDetalleTipo}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-800 border border-purple-200 rounded-md shadow-sm bg-gradient-to-r from-purple-100 to-pink-100"
                            >
                              {it.Nombre}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                <FormikTextArea
                  name="Observaciones"
                  label="Descripción general de la requisición (¿Para que? ¿Para cuando?)"
                  id="requisition-observation"
                />

                {/* --- PRODUCTOS --- */}
                <div className="w-full mt-6">
                  <div className="w-full">
                    <h3 className="text-lg font-semibold">Productos</h3>
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
                      <thead className="sticky top-0 bg-gray-100">
                        <tr>
                          <th className="w-12 p-2 text-center border">#</th>
                          <th className="p-2 text-center border w-28">
                            Imagen
                          </th>
                          <th className="p-2 text-center border w-28">
                            Cantidad
                          </th>
                          <th className="p-2 text-left border">Descripción</th>
                          <th className="p-2 text-center border w-14">
                            Eliminar
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((prod: any, idx: number) => (
                          <tr key={idx} className="odd:bg-gray-50">
                            {/* Número */}
                            <td className="p-1 text-center text-gray-600 border">
                              {idx + 1}
                            </td>

                            {/* image */}
                            <td className="p-1 text-center border">
                              <div className="flex flex-col items-center">
                                {prod.image && (
                                  <PhotoZoom
                                    src={
                                      prod.image instanceof File
                                        ? URL.createObjectURL(prod.image)
                                        : prod.image
                                    }
                                    alt="preview"
                                    title={""}
                                  ></PhotoZoom>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        // Mostrar loading en el botón o indicador
                                        const compressed =
                                          await compressImageToTarget(file, 2); // <-- 2KB target
                                        setValue(
                                          `Productos[${idx}].image`,
                                          compressed,
                                        );
                                        showToast(
                                          `Imagen comprimida a ${(compressed.size / 1024).toFixed(2)} KB`,
                                          "success",
                                        );
                                      } catch (error) {
                                        console.error(
                                          "Error comprimiendo:",
                                          error,
                                        );
                                        // Fallback: usar la imagen original
                                        setValue(
                                          `Productos[${idx}].image`,
                                          file,
                                        );
                                        showToast(
                                          "No se pudo comprimir la imagen, usando original",
                                          "warning",
                                        );
                                      }
                                    }
                                  }}
                                  className="text-xs"
                                />
                              </div>
                            </td>

                            {/* Cantidad */}
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

                            {/* Descripción */}
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

                            {/* Eliminar */}
                            <td className="p-1 text-center border">
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
