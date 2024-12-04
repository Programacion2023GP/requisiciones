import { FormikProps } from "formik";

export type FormikType = {
  validationSchema?: any;
  initialValues: Record<string, any>;
  children: (
    values: Record<string, any>,
    setValue: (name: string, value: any) => void,
    setTouched: (touched: Record<string, boolean>) => void, // Aquí va la corrección
  ) => React.ReactNode;
  buttonMessage?: string;
  onSubmit: (values: Record<string, any>) => void;
  ref?: React.Ref<FormikProps<Record<string, any>>>; // Correcta definición del tipo para refs
};
