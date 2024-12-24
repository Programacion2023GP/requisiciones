import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ColComponent, RowComponent } from "../responsive/Responsive";
import ModalComponent from "../components/modal/Modal";
import { AxiosRequest, GetAxios } from "../axios/Axios";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  FormikAutocomplete,
  FormikInput,
  FormikNumberInput,
  FormikTextArea,
} from "../components/formik/FormikInputs/FormikInput";
import FormikForm from "../components/formik/Formik";
import * as Yup from "yup";
import { showConfirmationAlert, showToast } from "../sweetalert/Sweetalert";
import PageTransition, {
  PageTransitionRef,
} from "../components/stepper/Stepper";
import Button from "../components/form/Button";
import { FormikProps } from "formik";
import { LuPlus } from "react-icons/lu";
import Tooltip from "../components/toltip/Toltip";
import { CgCloseO } from "react-icons/cg";
import { Agtable } from "../components/table/Agtable";
import { ColDef } from "ag-grid-community";
import Typography from "../components/typografy/Typografy";
import Actions from "./actions/Actions";
import Chip from "../components/chip/Chip";
import { createTw } from "react-pdf-tailwind";
import Observable from "../extras/observable";
import { PermissionMenu } from "../extras/menupermisos";

const ProductsComponent = memo(
  ({
    cantidad,
    descripcion,
    responsive,
    deleteField,
    formikSetValue,
    values,
    formikSetTouched,
  }: {
    cantidad: string;
    descripcion: string;
    responsive: any;
    deleteField: (cantidad: string, descripcion: string) => void;
    formikSetValue: (name: string, value: any) => void;
    values: Record<string, any>;
    formikSetTouched: (touched: Record<string, boolean>) => void;
  }) => {
    useEffect(() => {
      if (values?.values[cantidad]) {
        formikSetValue(cantidad, parseInt(values?.values[cantidad]));
      }
      if (values?.values[descripcion]) {
        formikSetValue(descripcion, values?.values[descripcion]);
      }
      if (values?.touched[cantidad]) {
        formikSetTouched({
          ...values.touched,
          [cantidad]: true, // Marca este campo como tocado
        });
      }

      if (values?.touched[descripcion]) {
        formikSetTouched({
          ...values.touched,
          [descripcion]: true, // Marca este campo como tocado
        });
      }
    }, []);
    return (
      <>
        <ColComponent responsive={{ "2xl": 4, md: 6 }}>
          <div className=" border-2 relative w-full   border-gray-300 rounded-lg shadow-lg p-4 my-4">
            <div className="absolute top-2 right-0 mr-2">
              <Button
                variant="outline"
                color="red"
                size="small"
                onClick={() => {
                  deleteField(cantidad, descripcion);
                }}
              >
                <CgCloseO className="cursor-pointer" />
              </Button>
            </div>
            <div className="mt-6"></div>
            <FormikNumberInput
              name={cantidad}
              label="Cantidad"
              decimals={false}
              min={0}
              // responsive={{...responsive , "2xl":6}}
            />
            <FormikInput
              name={descripcion}
              label="Descripcion"
              // responsive={{...responsive , "2xl":6}}
            />
          </div>
        </ColComponent>
      </>
    );
  }
);

type FormikCustomState = {
  initialValues: Record<string, any>;
  validationSchema: Record<string, any>;
  cont: number;
};
type ValuesRequisitonType = {
  IDDepartamento: 0;
  Observaciones: "";
  Solicitante: "";
  IDTipo: 0;
};
type ValuesFormik = {
  valuesRequisition: ValuesRequisitonType;
  valuesProducts: FormikCustomState;
};
type FormProductsComponentProps = {
  formik: FormikCustomState;
  responsive: any;
  ref?: React.Ref<FormikProps<any>>;
  NewValidations: (
    cantidad: string,
    descripcion: string
  ) => Record<string, any>;
  setFormik: Dispatch<SetStateAction<ValuesFormik>>;
  mutation: any;
};

const FormProductsComponent = forwardRef<
  FormikProps<any>,
  FormProductsComponentProps
>(({ responsive, NewValidations, setFormik, formik, mutation }, ref) => {
  const [fRespaldFormikProducts, setfRespaldFormikProducts] = useState({
    values: {},
    touched: {},
  });

  const handleMoreValues = () => {
    if (ref && "current" in ref && ref.current) {
      setfRespaldFormikProducts((prev) => ({
        touched: ref?.current?.touched || {},
        values: ref?.current?.values || {},
      }));
    }
    setFormik((prev) => ({
      ...prev,
      valuesProducts: {
        validationSchema: {
          ...prev.valuesProducts.validationSchema,
          ...NewValidations(
            `Cantidad${prev.valuesProducts.cont + 1}`,
            `Descripcion${prev.valuesProducts.cont + 1}`
          ),
        },
        initialValues: {
          ...prev.valuesProducts.initialValues,
          [`Cantidad${prev.valuesProducts.cont + 1}`]: null,
          [`Descripcion${prev.valuesProducts.cont + 1}`]: null,
        },
        cont: prev.valuesProducts.cont + 1,
      },
    }));
  };
  const deleteFieldFormik = (cantidad: string, descripcion: string) => {
    setFormik((prev) => {
      // Si el ref es válido, obtenemos los valores actuales
      if (ref && "current" in ref && ref.current) {
        setfRespaldFormikProducts((prev) => ({
          ...prev,
          values: ref?.current?.values || {},
        }));
      }

      // Copiamos los objetos para que sean mutables
      const newInitialValues = {
        ...prev.valuesProducts.initialValues,
        [cantidad]: false,
        [descripcion]: false,
      };
      const newValidationSchema = { ...prev.valuesProducts.validationSchema };

      delete newValidationSchema[cantidad];
      delete newValidationSchema[descripcion];

      const updatedState = {
        ...prev,
        valuesProducts: {
          initialValues: newInitialValues, // Estado actualizado sin las claves eliminadas
          validationSchema: newValidationSchema, // Validaciones actualizadas sin las claves eliminadas
          cont: prev.valuesProducts.cont - 1, // Reducimos el contador
        },
      };

      return updatedState;
    });
  };

  const AddButton = useMemo(
    () => (
      <div className="flex justify-start w-fit ml-2 mb-6">
        <Tooltip content="Agregar mas productos">
          <Button
            color="presidencia"
            variant="outline"
            onClick={handleMoreValues}
          >
            <LuPlus />
          </Button>
        </Tooltip>
      </div>
    ),
    []
  );
  const onSubmit = (values: Record<string, any>) => {
    let data = {};
    setFormik((prev) => {
      data = { ...prev.valuesRequisition, ...values }; // Make a copy of the previous state

      return {
        ...prev,
        valuesProducts: {
          cont: prev.valuesProducts.cont,
          initialValues: values, // Assuming `values` is defined somewhere in your scope
          validationSchema: prev.valuesProducts.validationSchema,
        },
      };
    });

    showConfirmationAlert(
      "¿Estás seguro?",
      "Esta acción no se puede deshacer."
    ).then((isConfirmed) => {
      if (isConfirmed) {
        // console.log(data)
        mutation.mutate({
          method: "POST",
          url: "/requisiciones/create",
          data: data,
        });
      } else {
        showToast("La acción fue cancelada.", "error");
      }
    });
  };
  return (
    <>
      {AddButton}

      <FormikForm
        key={formik.cont}
        ref={ref}
        onSubmit={onSubmit}
        // ref={formik}
        // buttonMessage={"Registrar"}
        validationSchema={Yup.object(formik.validationSchema)}
        initialValues={formik.initialValues}
        children={(values, setValue, setTouched) => (
          <>
            {Object.keys(values).map((item, index) => {
              if (index % 2 === 0) {
                const cantidadKey = item;
                const descripcionKey = `Descripcion${item.replace("Cantidad", "")}`;
                return (
                  <>
                    {values[cantidadKey] != false &&
                      values[descripcionKey] != false && (
                        <React.Fragment key={index}>
                          <ProductsComponent
                            formikSetTouched={setTouched}
                            values={fRespaldFormikProducts}
                            formikSetValue={setValue}
                            deleteField={deleteFieldFormik}
                            cantidad={cantidadKey}
                            descripcion={descripcionKey}
                            responsive={responsive}
                          />
                        </React.Fragment>
                      )}
                  </>
                );
              }
              return null;
            })}
          </>
        )}
      />
    </>
  );
});

const RequisicionesAdd = () => {
  const pageTransitionRef = useRef<PageTransitionRef>(null);

  const formik = useRef<FormikProps<Record<string, any>> | null>(null);
  const formikProducts = useRef<FormikProps<Record<string, any>> | null>(null);
  const NewValidations = (
    cantidad: string,
    descripcion: string
  ): Record<string, any> => {
    const validate = {
      [cantidad]: Yup.number().required("La cantidad es obligatoria"),
      [descripcion]: Yup.string().required("La descripción es obligatoria"),
    };
    return validate;
  };
  const [values, setValues] = useState<ValuesFormik>({
    valuesRequisition: {
      IDDepartamento: 0,
      Observaciones: "",
      Solicitante: "",
      IDTipo: 0,
    },
    valuesProducts: {
      initialValues: {
        Cantidad1: null,
        Descripcion1: null,
      },
      validationSchema: { ...NewValidations(`Cantidad1`, `Descripcion1`) },
      cont: 1,
    },
  });
  const [reloadTable, setReloadTable] = useState(false);
  const responsive = {
    "2xl": 6,
    xl: 6,
    lg: 6,
    md: 12,
    sm: 12,
  };
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
      // mutation.reset()
      setOpen(false);
      setReloadTable(true);
      setValues({
        valuesRequisition: {
          IDDepartamento: 0,
          Observaciones: "",
          Solicitante: "",
          IDTipo: 0,
        },
        valuesProducts: {
          initialValues: {
            Cantidad1: null,
            Descripcion1: null,
          },
          validationSchema: {
            ...NewValidations(`Cantidad1`, `Descripcion1`),
          },
          cont: 1,
        },
      });
      showToast(data.message, data.status);
      if (mutation.status === "success") {
        mutation.reset();
      }
      //   queryClient.refetchQueries({
      //     queryKey: ["users/index"],
      //   });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });

  const queryClient = useQueryClient();
  const { ObservablePost } = Observable();
  const [open, setOpen] = useState<boolean>(false);
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
      {
        queryKey: ["autorizadoresRequisition/cotizadores"],
        queryFn: () => GetAxios(`autorizadores/cotizadores`),
        refetchOnWindowFocus: true,
      },
    ],
  });
  const [groups, types, autorizadores] = queries;
  useEffect(() => {
    // first
    if (autorizadores.data && autorizadores.data.data) {
      ObservablePost("autorizadoresSelect", {
        autorizadores: autorizadores.data.data,
      });
    }
  }, [autorizadores.data]);

  const onSumbit = (values: Record<string, any>) => {
    setValues((prev) => ({
      ...prev,
      valuesRequisition: values as ValuesRequisitonType, // Casting correcto
    }));
  };

  const validationSchema = Yup.object({
    Solicitante: Yup.string().required("El solicitante es obligatorio"),
    IDDepartamento: Yup.number()
      .min(1, "El departamento es obligatorio")
      .required("El departamento es obligatorio"),
    IDTipo: Yup.number()
      .min(1, "El tipo  es obligatorio")
      .required("El tipo  es obligatorio"),
  });
  const [columnDefs] = useState<ColDef<any>[]>([
    {
      headerName: "IDRequisicion",
      field: "IDRequisicion",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Ejercicio",
      field: "Ejercicio",
      sortable: true,
      filter: true,
      filterParams: {
        defaultValue: "2024",
      },
    },
    {
      headerName: "Departamento",
      field: "Nombre_Departamento",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Solicitante",
      field: "Solicitante",
      sortable: true,
      filter: true,
    },

    {
      headerName: "FechaCaptura",
      field: "FechaCaptura",
      filter: "agDateColumnFilter",
      resizable: true,
      cellRenderer: (data: { value: string | number | Date }) => {
        // Asegúrate de que la fecha se muestre en un formato adecuado
        return data.value ? new Date(data.value).toLocaleDateString() : "";
      },
      filterParams: {
        comparator: (dateFromFilter, cellValue) => {
          if (cellValue == null) {
            return 0;
          }

          // Convertir cellValue a un objeto Date
          const cellDate = new Date(cellValue);

          // Si la conversión a Date es incorrecta, retorna 0 (filtro no encontrado)
          if (isNaN(cellDate.getTime())) {
            return 0;
          }

          // Eliminar las horas, minutos, segundos y milisegundos de ambas fechas
          const cellDateOnly = new Date(cellDate);
          const filterDateOnly = new Date(dateFromFilter);

          // Establecer la hora a las 00:00:00 para ambas fechas
          cellDateOnly.setHours(0, 0, 0, 0);
          filterDateOnly.setHours(0, 0, 0, 0);

          // Comparar solo las fechas (sin considerar horas, minutos o segundos)
          if (cellDateOnly < filterDateOnly) {
            return -1;
          } else if (cellDateOnly > filterDateOnly) {
            return 1;
          }

          return 0; // Si son iguales
        },
      },
    },

    {
      headerName: "Status",
      field: "Status",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Tipo",
      field: "Tipo",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Observaciones",
      field: "Observaciones",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Usuario asignado",
      field: "UsuarioAS",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Usuario UsuarioVoBo",
      field: "UsuarioVoBo",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Motivo de cancelación",
      field: "Motivo_AutEspecial",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Motivo de cancelación",
      field: "Motivo_AutEspecial",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Orden compra",
      field: "Orden_Compra",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Orden consolidada",
      field: "OC_Consolidada",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Usuario captura",
      field: "UsuarioCaptura",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Acciones",
      colId: "buttons",
      // field: "Rol", // Usamos colId para identificar la columna sin usar field
      // sortable: true,
      // filter: true,
      cellRenderer: (params: any) => (
        <Actions data={params.data} setReloadTable={setReloadTable} />
      ), // Usamos cellRendererFramework
    },
  ]);
  const buttonElement = useMemo(
    () => (
        <Tooltip content="Agregar Requisición">
          <div className="mb-4">
            <Button
              onClick={() => {
                pageTransitionRef.current?.reset();

                formikProducts.current?.resetForm({
                  values: { Cantidad1: null, Descripcion1: null },
                });
                formik.current?.resetForm({
                  values: {
                    IDDepartamento: 0,
                    Observaciones: "",
                    Solicitante: "",
                    IDTipo: 0,
                  },
                });

                setOpen(true);
                // toggleOpen();
              }}
              size="medium"
              color="blue"
              variant="solid"
            >
              <LuPlus />
            </Button>
          </div>
        </Tooltip>
    ),
    []
  );
  const getRowClass = (params: {
    node: { rowIndex: number };
    data: Record<string, any>;
  }) => {
    const { Status } = params?.data;
    if (Status == "CA") {
      return "class_ca";
    }
    if (Status == "AU") {
      return "class_au";
    }
    if (Status == "AS") {
      return "class_as";
    }
    if (Status == "CO") {
      return "class_co";
    }
    if (Status == "OC") {
      return "class_oc";
    }
    if (Status == "RE") {
      return "class_re";
    }
    if (Status == "SU") {
      return "class_su";
    }
  };

  return (
    <>
      <PermissionMenu IdMenu={["Listado", "SeguimientoRequis",'RequisicionesAdd']}>
        <div className="container mx-auto shadow-lg p-6 border mt-12">
          <Typography
            className="w-full text-center py-2"
            variant="h2"
            color="black"
            size="3xl"
          >
            la tabla empieza consultando el ejercicio del año actual
            {" " + new Date().getFullYear()}
          </Typography>
            <div className="flex w-full flex-row flex-wrap justify-center mb-6">
              <Chip message="Captura (CA)" className="bg-gray-400" />
              <Chip message="Autorizada (AU)" className="bg-black" />
              <Chip message="Asignado  (AS)" className="bg-purple-500" />
              <Chip message="Cotizado  (CO)" className="bg-orange-500" />
              <Chip message="Orden de Compra (OC)" className="bg-pink-500" />
              <Chip message="Rechazada  (RE)" className="bg-red-500" />
              <Chip message="Realizada  (RE)" className="bg-cyan-500" />
              <Chip message="Surtida  (SU)" className="bg-lime-500" />
            </div>
            <Agtable
            permissionsUserTable={{
              table:"Listado",
              buttonElement:"RequisicionesAdd"
            }}
              getRowClass={getRowClass}
              backUrl={{
                pathName: "requisiciones/index",
                startSearchFilter: {
                  where: `Ejercicio = '${new Date().getFullYear()}'`,
                },
                restart: reloadTable,
              }}
              filtersActive={{
                Ejercicio: "2024",
              }}
              columnDefs={columnDefs}
              buttonElement={buttonElement}
              colapseFilters
            />
        </div>

        <ModalComponent
          open={open}
          title="Requisicion"
          setOpen={() => {
            setOpen(false);
          }}
        >
          <div className="py-6">
            <PageTransition
              ref={pageTransitionRef}
              variant="push"
              renderButtons={(handlePrevPage, handleNextPage, currentPage) => (
                <div className="flex space-x-2">
                  {currentPage > 1 && (
                    <Button
                      onClick={() => {
                        setValues((prev) => ({
                          ...prev,
                          valuesProducts: {
                            ...prev.valuesProducts,
                            initialValues: formikProducts.current?.values ?? {},
                          },
                        }));
                        handlePrevPage();
                      }}
                      color="blue"
                      variant="outline"
                      size="small"
                    >
                      Anterior
                    </Button>
                  )}
                  <Button
                    type="submit"
                    onClick={() => {
                      if (currentPage == 2) {
                        formikProducts.current?.handleSubmit();
                        setTimeout(() => {
                          // console.log(formik.current?.touched )
                        }, 100);
                      }
                      if (currentPage == 1) {
                        formik.current?.handleSubmit();
                        setTimeout(() => {
                          // console.log(formik.current?.touched )

                          if (
                            Object.keys(formik?.current?.errors || {}).length ==
                            0
                          ) {
                            handleNextPage();
                          }
                        }, 100);
                      }
                    }}
                    color="blue"
                    variant="solid"
                    size="small"
                  >
                    {currentPage == 1 ? "Continuar" : "Registrar"}
                  </Button>
                </div>
              )}
            >
              <FormikForm
                onSubmit={onSumbit}
                ref={formik}
                // buttonMessage={"Registrar"}
                validationSchema={validationSchema}
                initialValues={values.valuesRequisition}
                children={(values) => (
                  <>
                    <FormikAutocomplete
                      responsive={responsive}
                      loading={groups.isLoading}
                      name="IDDepartamento"
                      label={"selecciona el departamento"}
                      options={groups.data?.data}
                      idKey={"IDDepartamento"}
                      labelKey={"Nombre_Departamento"}
                    />
                    <FormikAutocomplete
                      responsive={responsive}
                      loading={types.isLoading}
                      name="IDTipo"
                      label={"selecciona el tipo"}
                      options={types.data?.data}
                      idKey={"IDTipo"}
                      labelKey={"Descripcion"}
                    />
                    <FormikInput name="Solicitante" label="Solicitante" />
                    <FormikTextArea
                      label="Observaciones"
                      name="Observaciones"
                    />
                  </>
                )}
              />
              <FormProductsComponent
                mutation={mutation}
                formik={values.valuesProducts}
                responsive={responsive}
                ref={formikProducts}
                NewValidations={NewValidations}
                setFormik={setValues}
              />
            </PageTransition>
          </div>
        </ModalComponent>
      </PermissionMenu>
    </>
  );
};
export default RequisicionesAdd;
