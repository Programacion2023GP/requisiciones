import { UseMutationResult, useMutation } from "@tanstack/react-query";
import CardComponent from "../components/card/Card";
import Button from "../components/form/Button";
import FormikForm from "../components/formik/Formik";
import { FormikInput, FormikPasswordInput } from "../components/formik/FormikInputs/FormikInput";
import { ColComponent, RowComponent } from "../responsive/Responsive";
import * as Yup from "yup";
import { AxiosRequest } from "../axios/Axios";
import { showToast } from "../sweetalert/Sweetalert";
import Spinner from "../loading/Loading";

const LoginComponent = () => {
  const colComponents = {
    "2xl": 6,
    xl: 6,
    lg: 6,
    md: 12,
    sm: 12,
  };
  const validationSchema = Yup.object({
    Usuario: Yup.string().required("El usuario es obligatorio"),
    Password: Yup.string().required("La contraseña es requerida"),
  
  });
  const mutation = useMutation({
    mutationFn: ({ url, method, data }: { url: string; method: 'POST' | 'PUT' | 'DELETE'; data?: any }) =>
      AxiosRequest(url, method, data),
    
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem('permisos', JSON.stringify(data.data.permisos));

      localStorage.setItem('token', data.data.token);
      window.location.href = '/usuarios'
      showToast(data.message, data.status);
     
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Error al realizar la acción', 'error');
    },
  },);

  const onSubmit = (values:Record<string,any>)=>{
    mutation.mutate({
      url: `/auth/login`,
      method: 'POST',
      data: values,
    });
    console.log(mutation.isPending)
  }
  return (
    <>
      {mutation.status =='pending' && (<Spinner/>)}

      <div className="bg-gradient-to-tr from-presidencia  bg-gray-300 w-screen h-screen flex justify-center items-center">
        <RowComponent>
          <ColComponent responsive={colComponents}>
            {/* Tarjeta de Login Estilizada */}
            <CardComponent
              w="fit-content"
              h="auto"
              shape="rounded"
              title={() => (
                <p className="font-extrabold text-gray-800 text-3xl text-center py-6">
                  Iniciar sesión
                </p>
              )}
              content={() => (
                <FormikForm
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                  initialValues={{
                    Usuario: "",
                    Password: "",
                  }}
                  children={() => 
                    
                    (
                    <ColComponent>
                      <FormikInput
                        label="Usuario"
                        name="Usuario"
                      />
                      <FormikPasswordInput
                        label="Contraseña"
                        name="Password"
                      />
                      <div className="mt-8">
                        <Button
                        type="submit"
                          color="presidencia"
                          variant="outline"
                          size="medium"
                        
                        >
                          Iniciar sesión
                        </Button>
                      </div>
                    </ColComponent>
                  )}
                />
              )}
            />
          </ColComponent>

          <ColComponent responsive={{...colComponents,sm:0,md:0}}>
            {/* Título Elegante de Requisiciones */}
            <p className="text-center font-semibold text-gray-900 text-6xl mt-10 mb-8">
              Requisiciones
            </p>
        
          </ColComponent>
        </RowComponent>
      </div>
    </>
  );
};

export default LoginComponent;
