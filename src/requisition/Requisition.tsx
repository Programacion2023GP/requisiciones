import {
  Dispatch,
  SetStateAction,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { ColComponent, RowComponent } from "../responsive/Responsive";
import ModalComponent from "../components/modal/Modal";
import { AxiosRequest, GetAxios } from "../axios/Axios";
import { useMutation, useQueries } from "@tanstack/react-query";
import {
  FormikAutocomplete,
  FormikInput,
  FormikNumberInput,
  FormikTextArea,
} from "../components/formik/FormikInputs/FormikInput";
import FormikForm from "../components/formik/Formik";
import * as Yup from "yup";
import { showToast } from "../sweetalert/Sweetalert";
import PageTransition from "../components/stepper/Stepper";
import Button from "../components/form/Button";
import { FormikProps } from "formik";
import { LuPlus } from "react-icons/lu";
import Tooltip from "../components/toltip/Toltip";
import { CgCloseO } from "react-icons/cg";

const ProductsComponent = memo(
  ({
    cantidad,
    descripcion,
    responsive,
  }: {
    cantidad: string;
    descripcion: string;
    responsive: any;
  }) => {
    return (
      <>
        {/* <ColComponent responsive={{"2xl":4}}>
        <ColComponent responsive={responsive}>
      <div className="bg-red-100 w-full h-full">c</div>

        </ColComponent>
        <ColComponent responsive={responsive}>
      <div className="bg-blue-100 w-full h-full">c</div>

        </ColComponent>
    </ColComponent> */}

        <div className="w-full border-2 relative  border-gray-300 rounded-lg shadow-lg p-4 my-4">
          <div className="absolute top-2 right-0 mr-2">
            <Button variant="outline" color="red" size="small">
              {" "}
              <CgCloseO className="cursor-pointer" />
            </Button>
          </div>
          <FormikNumberInput
            name={cantidad}
            label="Cantidad"
            decimals={false}
            min={0}
            responsive={responsive}
          />
          <FormikInput
            name={descripcion}
            label="Descripcion"
            responsive={responsive}
          />
        </div>
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
  setValues: React.Dispatch<React.SetStateAction<ValuesFormik>>;
};

const FormProductsComponent = forwardRef<
  FormikProps<any>,
  FormProductsComponentProps
>(({ responsive, NewValidations, setFormik, formik, setValues }, ref) => {
  const handleMoreValues = () => {
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
  // const onSumbit = (values: Record<string, any>) => {
  //   setValues((prev) => ({
  //     ...prev,
  //     valuesProducts: values , // Casting correcto
  //   }));
  // };

  return (
    <>
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

      <FormikForm
        key={formik.cont}
        ref={ref}
        onSubmit={() => {}}
        // ref={formik}
        // buttonMessage={"Registrar"}
        validationSchema={Yup.object(formik.validationSchema)}
        initialValues={formik.initialValues}
        children={(values, setValue) => (
          <>
            {Object.keys(values).map((item, index) => {
              if (index % 2 === 0) {
                const cantidadKey = item;
                const descripcionKey = `Descripcion${item.replace("Cantidad", "")}`;
                return (
                  <div className="w-full mr-2" key={index}>
                    <ProductsComponent
                      cantidad={cantidadKey}
                      descripcion={descripcionKey}
                      responsive={responsive}
                    />
                  </div>
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
      cont: 1
    },
  });
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
    onSuccess: (data) => {
      setOpen(false);
      showToast(data.message, data.status);
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
  const [open, setOpen] = useState<boolean>(true);
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
  return (
    <>
      <ModalComponent
        open={open}
        title="Requisicion"
        setOpen={() => {
          setOpen(false);
        }}
      >
        <div className="py-6">
          <PageTransition
            variant="push"
            renderButtons={(handlePrevPage, handleNextPage, currentPage) => (
              <div className="flex space-x-2">
                {currentPage > 1 && (
                  <Button
                    onClick={() => {
                    //   console.log(
                    //     "aqui",
                    //  formikProducts.current?.values
                    //   );
                    setValues((prev) => ({
                      ...prev,
                      valuesProducts: {
                        ...prev.valuesProducts,
                        initialValues: formikProducts.current?.values ?? {},
                      },
                    }));
                    handlePrevPage()
                      
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
                    }
                    if (currentPage == 1) {
                      formik.current?.handleSubmit();
                      if (formik.current?.isValid) {
                        handleNextPage();
                      }
                    }
                    // handleNextPage();
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
                  <FormikTextArea label="Observaciones" name="Observaciones" />
                </>
              )}
            />
            <FormProductsComponent
              setValues={setValues}
              formik={values.valuesProducts}
              responsive={responsive}
              ref={formikProducts}
              NewValidations={NewValidations}
              setFormik={setValues}
            />
          </PageTransition>
        </div>
      </ModalComponent>
    </>
  );
};
export default RequisicionesAdd;
