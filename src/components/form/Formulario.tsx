import { createContext, Dispatch, useEffect, useReducer } from "react";
import React from 'react';

interface Form {
  initialValues: Record<string,any>; 
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  validations:Array<any>
}

interface Action {
  type: "initialValues"|"errors"|"touched"|"validation";
  action: "add"| "delete"|"edit" | "view";
  name?:string,
  value?:any,
  validation?: Record<string, any>; // Asegúrate de que sea un arreglo de objetos
  condition?:any,
  message?:any,

}


const form: Form = {
  initialValues: {},
  errors: {},
  touched: {},
  validations: [],
};


const reducer =(state:Form,action:Action):Form=>{
    switch(action.type){
        case "initialValues":
                switch (action.action) {
                  case "add":
                    return { ...state, initialValues: {...state.initialValues,...Objec("add", state.initialValues,action.name, action.value)} };
                    case "view":
                        return state; 
                  case "delete":
                    return { ...state, initialValues: Objec("delete", state.initialValues,action.name, action.value) };
                }
                break
        case "touched":

        switch (action.action) {
            case "add":
              return { ...state, touched: Objec("add",state.touched,action.name,action.value) };
            case "view":
              return state; // Retorna el estado sin cambios, ya que solo se imprime
            case "delete":
                return { ...state, touched:Objec("delete",state.touched,action.name,action.value) };

        }
        break
        case "validation":
            switch (action.action) {
                case "add":
                    return {
                        ...state,
                        validations: List("add", state.validations, action.validation)
                    };
                case "delete":
                    return {
                        ...state,
                        validations: List("delete", state.validations, action.validation)
                    };
            }
            break
            // ...
    
        case "errors":
            switch(action.action){
                case "add":
                    return {
                        ...state,
                        errors:{...validate(state.validations,state.errors,action.name? action.name : '',action.value)}
                      
                        
                    }
                    case "edit":
                    return {
                        ...state,
                        errors:{...action.validation}
                    }
            }
        break
            
        
    }
    return state;
}
const validate = (validations: Array<any>, errors: Record<string, string>, name: string, value: any): Record<string, string> => {
    validations.forEach(item => { 
        if (item.name ==name) {
            
            if ( item.validations?.required?.condition && !value) {
                // console.log(name,item.validations?.required,value)
                errors[name] = item.validations.required.message;
            }
            else if (item.validations?.minLength?.condition && value.length < item.validations.minLength.condition) {
                errors[name] = item.validations.minLength.message;
            }
            else if (item.validations?.maxLength?.condition && value.length > item.validations.maxLength.condition) {
                errors[name] = item.validations.maxLength.message;
            }
            else if (item.validations?.matches?.condition) {
                // Crea la expresión regular a partir de la condición
                const regex = new RegExp(item.validations.matches.condition); 
            
                // Validar el valor
                if (!regex.test(value)) {
                    errors[name] = item.validations.matches.message; // Asigna el mensaje de error
                } 
                else{
                    delete  errors[name]
                }
            }
            else{
               delete  errors[name]
            }
        }
            
    });
 
    
    return errors;
};



const List = (action: "add" | "delete", list: Array<any>, item: any): Array<any> => {
    if (list === undefined) {
        return []; // Retorna una lista vacía si no está definida
    }

    switch (action) {
        case "add":
            // Filtra la lista para eliminar el elemento existente con el mismo nombre
            const updatedList = list.filter(existingItem => existingItem.name !== item.name);
            // Agrega el nuevo elemento
            return [...updatedList, item];

        case "delete":
            return list.filter(existingItem => existingItem.name !== item.name); 

        default:
            return list;
    }
};




const Objec = (action: "add" | "delete" | "view",object:Record<string,any>,name:string|undefined,value:any):Record<string,any>=>{
  if (name==undefined) {
    return object;
  }
  switch (action) {
      case "add":
  
          return {...object,[name]:value}; 
          
          case "delete":
              const { [name]: _, ...newObject } = object; 
              return newObject;
              
              case "view":
  
            return object; 

        default:
            return object; 
    }
}

interface FormContextType {
    data: Form;
    setData: Dispatch<Action>; // Type para la función setData
  }
  

interface IFormulario{
    children: (props: { values: Record<string, any> }) => React.ReactNode;
    onSubmit?: (values: Record<string, any>) => void; // Acepta un argumento
}
export const FormContext = createContext<FormContextType | undefined>(undefined);
export const Formulario :React.FC<IFormulario>= ({children,onSubmit}) => {
  const [data,setData] = useReducer(reducer,form)
 useEffect(()=>{
 },[children])
 const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    data.validations.forEach(validationItem => {
        const { name, validations } = validationItem;
        const value = data.initialValues[name];
        
        if (validations?.required?.condition && !value) {
            newErrors[name] = validations.required.message;
        } else if (validations?.minLength?.condition && value.length < validations.minLength.condition) {
            newErrors[name] = validations.minLength.message;
        } else if (validations?.maxLength?.condition && value.length > validations.maxLength.condition) {
            newErrors[name] = validations.maxLength.message;
        } else if (validations?.matches?.condition) {
            const regex = new RegExp(validations.matches.condition); // Asegúrate de que condition sea una cadena válida
            if (!regex.test(value)) {
                newErrors[name] = validations.matches.message;
            }
        }
        
    });
   
    
    // Update the errors state
    setData({
        type: "errors",
        action: "edit",
        name: "", // not used for bulk update
        validation: newErrors,
    });

    // If there are no errors, call onSubmit
    if (Object.keys(newErrors).length === 0 && onSubmit) {
        onSubmit(data.initialValues);
    }
};



  return (  
    <form onSubmit={submit}>
        <FormContext.Provider value={{data,setData}}>
         {children({values:data.initialValues})}
         <button
            type="submit"
            className="w-24 h-10 bg-cyan-500 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:bg-cyan-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50"
          >
            Registrar
          </button>
        </FormContext.Provider>
    </form>
  );
};

