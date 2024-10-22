import { useContext, useEffect } from "react";
import { FormContext } from "../Formulario";
interface ValidatioString {
  condition: string;
  message: string;
}
interface ValidationBoolean {
  condition: boolean;
  message: string;
}

interface ValidatioNumber {
  condition: number;
  message: string;
}

interface Props {
  type?: "text" | "email";
  value?: string | null;
  existForm?: boolean;
  name: string;
  label: string;
  disabled?: boolean;
  required?: ValidationBoolean;
  minLength?: ValidatioNumber;
  maxLength?: ValidatioNumber;
  matches?: ValidatioString;
}

export const FInput: React.FC<Props> = ({
  existForm = true,
  value = null,
  name,
  label,
  required,
  disabled = false,
  matches,
  maxLength,
  minLength,
  type = "text",
}) => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FInput debe estar dentro de un FormProvider");
  }

  const { data, setData } = context;

  useEffect(() => {
    if (existForm) {
      setData({ type: "initialValues", action: "add", name, value });
    } else {
      setData({ type: "initialValues", action: "delete", name, value });
      setData({
        type: "validation",
        action: "delete",
        validation: { name, validations: {} },
      });
    }
  }, [value, name, existForm]);

  useEffect(() => {
    const validationObj: Record<string, any> = {};
    if (required) {
      validationObj.required = {
        condition: required.condition,
        message: required.message,
      };
    }
    if (minLength) {
      validationObj.minLength = {
        condition: minLength.condition,
        message: minLength.message,
      };
    }
    if (maxLength) {
      validationObj.maxLength = {
        condition: maxLength.condition,
        message: maxLength.message,
      };
    }
    if (matches) {
      validationObj.matches = {
        condition: matches.condition,
        message: matches.message,
      };
    }

    // Solo actualiza las validaciones si han cambiado
    // if (hasValidationChanged) {

    setData({
      type: "validation",
      action: "add",
      validation: { name, validations: validationObj },
    });
    // }
  }, [
    name,
    required?.message,
    required?.condition,
    minLength?.message,
    minLength?.condition,
    maxLength?.condition,
    maxLength?.message,
    matches?.condition,
    matches?.message,
  ]);

  const handleChange = (e: { target: { value: any } }) => {
    const upperCaseValue = e.target.value.toUpperCase();
  
    setData({
      type: "initialValues",
      action: "add",
      name,
      value: upperCaseValue, // Convertir a mayúsculas
    });
  
    setData({
      type: "errors",
      action: "add",
      name,
      value: upperCaseValue, // Convertir a mayúsculas
    });
  };
  

  return (
    <>
      {existForm && (
     <div className="relative mb-6">
     <input
       className={`block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-b-2 rounded-md appearance-none focus:outline-none focus:ring-0 
          peer ${
           data.errors?.[name] ? "border-red-600" : "border-gray-300"
         }
         ${data.initialValues?.[name] && !data.errors?.[name] && "border-teal-300"}
         `

        }
        
       type={type}
       name={name}
       id={name}
       value={data.initialValues?.[name] || ""}
       disabled={disabled}
       onBlur={() => {
         setData({
           type: "errors",
           action: "add",
           name,
           value: data.initialValues?.[name],
         });
       }}
       onChange={handleChange}
       placeholder=" " // Mantén el placeholder vacío para el label flotante
     />
     <label
       htmlFor={name}
       className={`absolute left-3 top-2 text-sm transition-all duration-300 transform origin-[0] 
        ${data.initialValues?.[name] ? '-translate-y-4 scale-75' : 'scale-100 text-gray-500'} 
        peer-placeholder-shown:top-2 
        peer-focus:-translate-y-4 peer-focus:scale-75 ${
          data.errors?.[name] ? "text-red-600" : ""
        }
                 ${data.initialValues?.[name] && !data.errors?.[name] && "text-teal-300"}

        `}
     >
       {label}
     </label>
     {data.errors?.[name] && (
       <p className="text-red-600 text-xs italic mt-2">
         Error: {data.errors?.[name]}
       </p>
     )}
   </div>
   
    
      )}
    </>
  );
};
