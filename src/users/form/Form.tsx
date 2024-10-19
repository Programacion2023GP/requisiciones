// import React from "react";
import { Formulario } from "../../components/form/Formulario";
import { FInput } from "../../components/form/input/Input";

const FormUsers = ({}) => {
  const submit = (values: Record<string, any>) => {
    console.log(values);
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
