import React, { useEffect, useMemo, useRef, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import {
  FormikAutocomplete,
  FormikInput,
  FormikNumberInput,
  FormikTextArea,
} from "../../components/formik/FormikInputs/FormikInput";
import FormikForm from "../../components/formik/Formik";
import * as Yup from "yup";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { FormikProps } from "formik";
import CollapseComponent from "../../components/colapse/Colapse";
import { ColComponent } from "../../responsive/Responsive";
import Button from "../../components/form/Button";
import { showConfirmationAlert, showToast } from "../../sweetalert/Sweetalert";
import { BsTrash3Fill } from "react-icons/bs";
import Spinner from "../../loading/Loading";
import Observable from "../../extras/observable";
import PdfRequisition from "../pdf/Pdfrequisition";

type PropsRequisition = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setReloadTable: React.Dispatch<React.SetStateAction<boolean>>;
};
type PropsHandleAddProducts = {
  cont: Array<number>;
  dropInitialValue: (index: number) => any;
};
const HandleAddProduct: React.FC<PropsHandleAddProducts> = ({
  cont,
  dropInitialValue,
}) => {
  return (
    <>
      {cont.map((item: any, index) => {
        return (
          <ColComponent responsive={{ "2xl": 4, lg: 6, md: 6 }}>
            <div className="flex flex-col shadow-sm border-2 border-gray-300 bg-white rounded-md py-6 px-2 mb-2 relative">
              <BsTrash3Fill
                className="absolute right-1 top-2 text-red-500 w-5 h-5 cursor-pointer z-50"
                onClick={() => {
                  dropInitialValue(item);
                }}
              />
              <div
                className={`relative ${item != cont[cont.length - 1] && "opacity-40"}`}
              >
                {/* Capa bloqueante, se asegura de cubrir completamente el área */}
                <div
                  className={`w-full h-full absolute top-0 left-0 ${
                    item != cont[cont.length - 1]
                      ? "cursor-not-allowed z-[500]  pointer-events-auto"
                      : ""
                  }`}
                />
                {/* Campos de entrada de Formik */}
                <FormikNumberInput
                  name={`Cantidad${item}`}
                  label="Cantidad"
                  decimals={false}
                />

                <FormikInput name={`Descripcion${item}`} label="Descripción" />
              </div>
            </div>
          </ColComponent>
        );
      })}
    </>
  );
};
const RequisitionForm: React.FC<PropsRequisition> = ({
  open,
  setOpen,
  title,
  setReloadTable,
}) => {
  const { ObservableGet } = Observable();

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
      setOpen(false);
      setOpenPdf(false);
      setReloadTable(true);

      showToast(data.message, data.status);
      if (mutation.status === "success") {
        mutation.reset();
      }
    },
    onError: (error: any) => {
      setOpenPdf(false);
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });
  const dataFormik = {
    IDDepartamento: 0,
    Observaciones: "",
    Solicitante: "",
    IDTipo: 0,
    Centro_Costo: 0,
    Cantidad1: 0,
    Descripcion1: "",
  };
  const object = Yup.object({
    Solicitante: Yup.string().required("El solicitante es requerido"),
    IDDepartamento:
      localStorage.getItem("role") === "CAPTURA"
        ? Yup.number().nullable()
        : Yup.number()
            .transform(
              (value, originalValue) => (isNaN(value) ? null : value) // Si no es un número, lo convierte en null
            )
            .min(1, "El departamento es requerido")
            .required("El departamento es requerido"),
    Centro_Costo:
      localStorage.getItem("role") === "CAPTURA"
        ? Yup.number().nullable()
        : Yup.number()
            .min(1, "El costo es requerido")
            .required("El costo es requerido"),
    IDTipo: Yup.number()
      .min(1, "El tipo es requerido")
      .required("El tipo es requerido"),
    Observaciones: Yup.string().required("Las observaciones es requerido"),
    Cantidad1: Yup.number()
      .min(1, "La cantidad debe ser mayor a 0")
      .required("La cantidad es requerida"),
    Descripcion1: Yup.string().required("La descripcion es requerida"),
  }) as Yup.ObjectSchema<{
    Solicitante: string;
    IDDepartamento: number;
    IDTipo: number;
    Centro_Costo: number;
    Observaciones: string;
    [key: string]: any;
  }>;
  const [values, setValues] = useState<Record<string, any> | null>(null);
  const [cont, setCont] = useState<Array<number>>([1]);
  const [validationSchema, setValidationSchema] = useState(object);
  // const [spiner, setSpiner] = useState<boolean>(false);
  const [openPdf, setOpenPdf] = useState<boolean>(false);

  useEffect(() => {
    const FormRequisicion = ObservableGet("FormRequisicion") as Record<
      string,
      any
    >;
    let dataForm = FormRequisicion?.data?.data;

    dataForm = Array.isArray(dataForm) ? dataForm[0] : dataForm;

    const finalJson: Record<string, any> = { ...dataForm };

    console.log("Inicio del procesamiento:", finalJson);

    const conteo: number[] = [];
    if (Array.isArray(FormRequisicion?.data?.data)) {
      FormRequisicion.data.data.forEach((item: any, index: number) => {
        finalJson[`Cantidad${index + 1}`] = item.Cantidad;
        finalJson[`Descripcion${index + 1}`] = item.Descripcion;
        conteo.push(index + 1);
      });
    }
    delete finalJson["Cantidad"];
    delete finalJson["Descripcion"];

    setValues(Object.keys(finalJson).length > 0 ? finalJson : dataFormik);
    setCont(Array.isArray(FormRequisicion?.data?.data) ? conteo : [1]);

    setValidationSchema(object);
  }, [open]);

  const formik = useRef<FormikProps<Record<string, any>> | null>(null);
  const { ObservablePost } = Observable();

  const onSumbit = async (values: Record<string, any>) => {
    setValues(values);
    const products = Object.keys(values)
      .filter((key) => key.startsWith("Cantidad"))
      .map((key) => {
        const index = key.replace("Cantidad", ""); // Extract the index
        return {
          Cantidad: values[key],
          Descripcion: values[`Descripcion${index}`],
        };
      });
    try {
      const result = await ObservablePost("PdfRequisicion", {
        data: {
          products: products,
          pdfData: {
            Nombre_CC: values.Centro_Costo,
            Observaciones: values.Observaciones,
          },
          status: "CP",
        },
      });
    } catch (e) {
    } finally {
      // setSpiner(false);
      setOpenPdf(true);

      // mutation.mutate({
      //   url: "/requisiciones/create",
      //   method: "POST",
      //   data: values,
      // });
    }
  };
  const responsive = {
    "2xl": 6,
    xl: 6,
    lg: 6,
    md: 12,
    sm: 12,
  };
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
  const handleModified = (name: string, value: number | string) => {
    const val = value as number;
    name === "IDDepartamento" &&
      val > 0 &&
      formik.current?.setFieldValue(
        "Centro_Costo",
        groups.data?.data.find((it: any) => it.IDDepartamento == value)
          .Centro_Costo > 0
          ? groups.data?.data.find((it: any) => it.IDDepartamento == value)
              .Centro_Costo
          : 0
      );
  };
  const dropInitialValue = (index: number): any => {
    if (cont.length == 1) {
      showToast("No se puede borrar el unico producto existente", "warning");
      return;
    }

    // Limpia los valores y validaciones dinámicas asociadas
    delete formik.current?.values[`Cantidad${index}`];
    delete formik.current?.values[`Descripcion${index}`];

    setValues((prev: any) => {
      const updatedValues = { ...prev };
      delete updatedValues[`Cantidad${index}`]; // Eliminar el valor de Cantidad
      delete updatedValues[`Descripcion${index}`]; // Eliminar el valor de Descripcion
      return updatedValues;
    });

    setValidationSchema(
      (
        prev: Yup.ObjectSchema<{
          Solicitante: string;
          IDDepartamento: number;
          IDTipo: number;
          Centro_Costo: number;
          Observaciones: string;
          [key: string]: any;
        }>
      ) => {
        const updatedFields = { ...prev.fields };

        delete updatedFields[`Cantidad${index}`];
        delete updatedFields[`Descripcion${index}`];

        return Yup.object(updatedFields) as Yup.ObjectSchema<{
          Solicitante: string;
          IDDepartamento: number;
          IDTipo: number;
          Centro_Costo: number;
          Observaciones: string;
          [key: string]: any;
        }>;
      }
    );
    setCont((prev) => prev.filter((i: number) => i !== index));
  };

  const handleMoreProducts = () => {
    const cantidad =
      formik?.current?.values[`Cantidad${cont[cont.length - 1]}`];

    const descripcion =
      formik?.current?.values[`Descripcion${cont[cont.length - 1]}`];
    // Asegurarte de que 'cantidad' es un número antes de hacer la comparación
    if (
      (parseInt(cantidad) > 0 &&
        typeof descripcion === "string" &&
        descripcion !== "") ||
      cont.length == 0
    ) {
      const size = cont[cont.length - 1];

      formik?.current?.setValues((prev: any) => ({
        ...prev,
        [`Cantidad${size + 1}`]: 0,
        [`Descripcion${size + 1}`]: "",
      }));
      setValidationSchema((prev: any) => {
        const updatedFields = { ...prev.fields };
        updatedFields[`Cantidad${size + 1}`] = Yup.number()
          .min(1, "La cantidad debe ser mayor a 0")
          .required("La cantidad es requerida");
        updatedFields[`Descripcion${size + 1}`] = Yup.string().required(
          "La descripcion es requerida"
        );
        return Yup.object(updatedFields) as Yup.ObjectSchema<{
          Solicitante: string;
          IDDepartamento: number;
          IDTipo: number;
          Centro_Costo: number;
          Observaciones: string;
          [key: string]: any;
        }>;
      });

      setCont((prev) => [...prev, prev[prev.length - 1] + 1]);
    } else {
      showToast(
        "No se pueden agregar mas productos hasta terminar de llenar el anterior",
        "info"
      );
    }
  };

  return (
    <>
      {openPdf && (
        <PdfRequisition
          open={openPdf}
          setOpen={() => {
            setOpenPdf(false);
          }}
          children={
            <div className="w-full flex justify-end items-end ">
              <div className="w-fit mr-8 mt-2">
                <Button
                  variant="solid"
                  color="blue"
                  size="small"
                  onClick={() => {
                    mutation.mutate({
                      url: "/requisiciones/create",
                      method: "POST",
                      data: values,
                    });
                  }}
                >
                  Registrar
                </Button>
              </div>
            </div>
          }
        />
      )}
      {values && Object.keys(values).length > 0 && (
        <ModalComponent
          open={open}
          setOpen={() => {
            setOpen(false);
          }}
          title={title}
        >
          {mutation.status === "pending" && <Spinner />}
          <div className=" mt-2 p-2">
            <FormikForm
              // key={cont[cont.length - 1]}
              onSubmit={onSumbit}
              ref={formik}
              buttonMessage={"Vista previa"}
              validationSchema={validationSchema}
              initialValues={values}
              children={(v) => {
                return (
                  <>
                    {localStorage.getItem("role") != "CAPTURA" && (
                      <>
                        <FormikAutocomplete
                          responsive={responsive}
                          loading={groups.isLoading}
                          name="IDDepartamento"
                          label={"selecciona el departamento"}
                          options={groups.data?.data}
                          idKey={"IDDepartamento"}
                          labelKey={"Nombre_Departamento"}
                          handleModified={handleModified}
                          handleModifiedOptions={{ name: "IDDepartamento" }}
                        />
                        <FormikAutocomplete
                          responsive={responsive}
                          loading={groups.isLoading}
                          name="Centro_Costo"
                          label={"selecciona el centro de costo"}
                          options={groups.data?.data}
                          idKey={"Centro_Costo"}
                          labelKey={"Centro_Costo"}
                        />
                      </>
                    )}

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
                      responsive={responsive}
                      name="Solicitante"
                      label="Solicitante"
                    />
                    <FormikTextArea
                      label="Observaciones"
                      name="Observaciones"
                    />
                    <CollapseComponent title="Detalles de la requisición">
                      <div className="mt-2"></div>
                      <div className="w-fit mb-4">
                        <Button
                          type="button"
                          color="teal"
                          variant="solid"
                          size="small"
                          onClick={handleMoreProducts}
                        >
                          Agregar Producto
                        </Button>
                      </div>
                      <HandleAddProduct
                        cont={cont}
                        dropInitialValue={dropInitialValue}
                      />
                    </CollapseComponent>
                  </>
                );
              }}
            />
          </div>
        </ModalComponent>
      )}
    </>
  );
};
export default RequisitionForm;
