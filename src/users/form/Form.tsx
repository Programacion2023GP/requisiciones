// import React from "react";
import { useContext, useRef } from "react";
import { FormHandle, Formulario } from "../../components/form/Formulario";
import { FInput } from "../../components/form/input/Input";
import { FSelect } from "../../components/form/select/Select";
import { ContextUsers } from "..";
import { Axios } from "../../axios/axios";

const FormUsers = ({}) => {
  const ref = useRef<FormHandle>(null);
  const context = useContext(ContextUsers);
  if (!context) {
    throw new Error(
      "SomeChildComponent must be used within a ContextUsers.Provider"
    );
  }
  const { departamentos, setOpen, setAlert, getUsers, edituser, modal } =
    context;
  const submit = (values: Record<string, any>) => {
    if (!edituser) {
      Axios.post("/users", values)
        .then((s) => {
          console.log(s.data);
          ref.current?.resetForm();
          setAlert({
            loading: true,
            title: s.data.title,
            message: s.data.message,
            type: "success",
            icon: <i className="ri-shield-user-line ri-2x"></i>,
          });
          setOpen(false);
          getUsers();
        })
        .catch((e) => {
          setAlert({
            loading: true,
            title: e.response.data.title,
            message: e.response.data.message,
            type: "error",
            icon: <i className="ri-shield-user-line ri-2x"></i>,
          });
        });
    }
    else{
      Axios.put(`/users/${edituser.id}`, values)
       .then((s) => {
          console.log(s.data);
          ref.current?.resetForm();
          setAlert({
            loading: true,
            title: s.data.title,
            message: s.data.message,
            type: "success",
            icon: <i className="ri-shield-user-line ri-2x"></i>,
          });
          setOpen(false);
          getUsers();
        })
       .catch((e) => {
          setAlert({
            loading: true,
            title: e.response.data.title,
            message: e.response.data.message,
            type: "error",
            icon: <i className="ri-shield-user-line ri-2x"></i>,
          });
        });
    }
  }

  return (
    <Formulario ref={ref} onSubmit={submit}>
      {({}) => (
        <>
          <FInput
            label="nombre"
            name="name"
            value={edituser?.name || null}
            required={{ condition: true, message: "es necesario el nombre" }}
          />
          <FInput
            label="Apellido Paterno"
            name="paternalname"
            value={edituser?.paternalname || null}
            required={{ condition: true, message: "es necesario el nombre" }}
          />
          <FInput
            label="Apellido Materno"
            name="maternalname"
            value={edituser?.maternalname || null}
            required={{ condition: true, message: "es necesario el nombre" }}
          />
          <FInput
            label="Correo electronico"
            name="email"
            type="email"
            value={edituser?.email || null}
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
            name="id_group"
            label="Selecciona el departamento correspondiente"
            keyLabel="group"
            keyValue="id"
            value={edituser?.id_group || null}
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
          <button
            type="submit"
            className="w-24 h-10 bg-cyan-500 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out transform hover:bg-cyan-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50"
          >
            {modal?.messageButton}
          </button>
        </>
      )}
    </Formulario>
  );
};

export default FormUsers;
