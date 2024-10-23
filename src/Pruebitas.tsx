// import { Formulario } from "./components/form/Formulario";
// import { FInput } from "./components/form/input/Input";
import "./pruebitas.css";
import "remixicon/fonts/remixicon.css"; // Importa los estilos de Remix Icons

import { IndexUsers } from "./users";
import Header from "./components/header/Header";
import  { Dropdown, Sidebar, SidebarItem } from "./components/sidebar/Sidebar";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import { CatalogueIndexStatus } from "./catalogues/status/Status";

export const Pruebitas = () => {
  useEffect(()=>{
    console.log("cargando inicio");
  },[])
  return (
    <>
   <div className="flex h-screen">
      <Router>
        <Sidebar>
          <SidebarItem icon="ri-dashboard-line" label="Usuarios" isOpen={true} href="/users" />
          <Dropdown
            isOpen={true}
            label="Catalogos"
            items={[
              { label: 'Estatus', href: '/catalogos/estatus', icon: 'ri-information-line' },
            ]}
          />
          <SidebarItem icon="ri-settings-3-line" label="Configuración" isOpen={true} href="/configuracion" />
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 bg-gray-100 p-6">
            <Routes>
            <Route path="/catalogos/estatus" element={<CatalogueIndexStatus/>} />

              <Route path="/users" element={<IndexUsers />} />
              {/* Puedes añadir más rutas aquí */}
            </Routes>
            <Outlet />
          </main>
        </div>
      </Router>
    </div>
  
    </>
  );
};

