// import React from "react";
import { useContext } from "react";
import { Formulario } from "../../components/form/Formulario";
import { FInput } from "../../components/form/input/Input";
import { FSelect } from "../../components/form/select/Select";
import { ContextUsers } from "..";
import { Axios } from "../../axios/axios";

const FormUsers = ({}) => {
  const context = useContext(ContextUsers);
  if (!context) {
    throw new Error(
      "SomeChildComponent must be used within a ContextUsers.Provider"
    );
  }
  const { departamentos,setOpen } = context;
  const submit = (values: Record<string, any>) => {
    Axios.post("/users", values)
      .then((s) => {
        console.log(s.data);
        setOpen(false)
      })
      .catch((e) => {console.log(e);});
  };

  return (
    <Formulario onSubmit={submit}>
      {({}) => (
        <>
          <FInput
            label="nombre"
            name="Name"
            required={{ condition: true, message: "es necesario el nombre" }}
          />
          <FInput
            label="Apellido Paterno"
            name="PaternalName"
            required={{ condition: true, message: "es necesario el nombre" }}
          />
          <FInput
            label="Apellido Materno"
            name="MaternalName"
            required={{ condition: true, message: "es necesario el nombre" }}
          />
          <FInput
            label="Correo electronico"
            name="Email"
            type="email"
            matches={{
              condition:
                '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@(([^<>()[\\]\\\\.,;:\\s@"]+\\.)+[^<>()[\\]\\\\.,;:\\s@"]{2,})$',
              message: "el formato es incorrecto",
            }}
            required={{
              condition: true,
              message: "es necesario el correo electronico",
            }}
          />
          <FSelect
            name="Departamento"
            label="Selecciona el departamento correspondiente"
            keyLabel="Departamento"
            keyValue="id"
            options={departamentos}
            required={{
              condition: true,
              message: "el departamento es requerido",
            }}
          />

          {/* <FInput
            label="nombre"
            name="Password"
            required={{ condition: true, message: "es necesario el nombre" }}
          /> */}
        </>
      )}
    </Formulario>
  );
};

export default FormUsers;
