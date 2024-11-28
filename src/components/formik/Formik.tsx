import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { FormikType } from "./types/FormikType";
import { forwardRef, useEffect } from "react";
import { RowComponent } from "../../responsive/Responsive";

// FormikForm ahora es un componente de tipo React.FC que usa forwardRef
const FormikForm = forwardRef<FormikProps<Record<string, any>>, FormikType>((
  {
    onSubmit,
    initialValues,
    validationSchema,
    children,
    buttonMessage,
  }, ref) => {
 
  return (
    <Formik
      innerRef={ref}  // Pasamos el ref al Formik usando innerRef
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        // Llamamos a onSubmit del componente padre
        onSubmit(values as Record<string, any>);

        // Después de enviar, cambiamos el estado de submitting a false
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className="space-y-4">
          <RowComponent>{children(values)}</RowComponent>
          <div className="flex justify-end">
           {buttonMessage && (

          <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 text-sm rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"
              disabled={isSubmitting}  // Añadimos disable cuando el formulario está enviando
            >
              {buttonMessage}
            </button>
           )} 
          </div>
        </Form>
      )}
    </Formik>
  );
});

// Exportamos el componente FormikForm
export default FormikForm;
