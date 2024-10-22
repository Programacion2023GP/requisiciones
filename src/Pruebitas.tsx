// import { Formulario } from "./components/form/Formulario";
// import { FInput } from "./components/form/input/Input";
import "./pruebitas.css";
import "remixicon/fonts/remixicon.css"; // Importa los estilos de Remix Icons

import { IndexUsers } from "./users";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import { useEffect } from "react";

export const Pruebitas = () => {
  useEffect(()=>{
    console.log("cargando inicio");
  },[])
  return (
    <>
     <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-100 p-6">
        <IndexUsers />
        </main>
      </div>
    </div>
      {/* <Header />
      <IndexUsers /> */}
    </>
  );
};
// const submit = (values: Record<string, any>) => {
//   console.log("Valores del formulario:", values);
// };
// <Formulario onSubmit={submit}>
//   {({ values }) => (
//     <>
//       <FInput
//         label="nombre"
//         name="nombre"
//         required={{ condition: true, message: "es necesario el nombre" }}
//         minLength={{
//           condition: 3,
//           message: "es requerido almenos 3 letras",
//         }}
//       />
//       <FInput
//         existForm={values.nombre ? true : false}
//         label="apellido"
//         name="app"
//         required={{
//           condition:
//             values.nombre && values.nombre.length > 5 ? true : false,
//           message: "escriba su apellido",
//         }}
//       />
//       <button type="submit">registrar</button>
//     </>
//   )}
// </Formulario>
