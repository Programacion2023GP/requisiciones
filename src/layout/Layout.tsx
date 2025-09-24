import React, { useMemo } from "react";
import { ColComponent, RowComponent } from "../responsive/Responsive";
import SidebarComponent from "./sidebar/Sidebar";
import HeaderComponent from "./header/Header";
import Button from "../components/form/Button";
import { Outlet } from "@tanstack/react-router";
import { create } from "zustand";
import OpenHook from "../hooks/open";
import { LayoutType } from "./types/LayoutTypes";
import { LuMenu } from "react-icons/lu";
import { Document, PDFViewer, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import CustomTutorial, { Guide } from "../components/tutorial/CustomTutorial";
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2px solid #e2e8f0",
    textAlign: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
  },
  companyInfo: {
    fontSize: 12,
    color: "#4a5568",
    marginBottom: 4,
  },
});
// Definir el tipo de estado para el store de Zustand
const tw = createTw({});

const LayoutRenderer: React.FC<LayoutType> = ({ outlet, sidebar, open }) => {
 const tutorial: Guide[] = [
  {
    question: "¿Cómo registrar una requisición?",
    referenceStart: "#btn-add-requisition",
    response: "Haz clic en el botón para añadir una nueva requisición.",
    afterOpenTutorial: () => {
      const mnuSeguridad = document.querySelector<HTMLElement>("#MnuRequisiciones")?.click();
    },

    action: () => {
      document.querySelector<HTMLButtonElement>("#btn-add-requisition")?.click();
    },
    steps: [
      {
        referenceStart: "#requisition-type",
        response: "Selecciona el tipo de requisición.",
      },
      {
        referenceStart: "#requisition-solicitante",
        response: "Aquí aparecerá automáticamente el nombre de tu director.",
      },
      {
        referenceStart: "#requisition-observation",
        response: "Ingresa el motivo de la requisición.",
      },
      {
        referenceStart: "#requisition-products",
        response: "Abre la lista de productos de la requisición.",
        action: () => {
          document.querySelector<HTMLButtonElement>("#btn-requisition-products")?.click();
        },
      },
      {
        referenceStart: "#form-requisition-addproduct",
        response: "Agrega un nuevo producto a la lista.",
      },
      {
        referenceStart: "#form-requisition-quantityproduct1",
        response: "Especifica la cantidad del producto.",
      },
      {
        referenceStart: "#form-requisition-descriptionproduct1",
        response: "Agrega la descripción del producto.",
      },
      {
        referenceStart: "#form-requisition-deleteproduct",
        response: "Elimina un producto de la lista.",
      },
      {
        referenceStart: "#form-requisition-submitpreview",
        response: "Revisa la previsualización de la requisición.",
      },
    ],
  },
  {
    question: "¿Cómo registrar un usuario?",
    referenceStart: "#btn-menu-sidebar",
    response: "Haz clic en el menú lateral.",
    action: () => {
      const sidebar = document.querySelector<HTMLButtonElement>("#btn-menu-sidebar");
      const mnuSeguridad = document.querySelector<HTMLElement>("#MnuSeguridad");

      if (sidebar && mnuSeguridad) {
        const isHidden = mnuSeguridad.offsetParent === null;
        if (isHidden) {
          sidebar.click();
          console.log("Menú abierto");
        } else {
          console.log("El menú ya estaba abierto");
        }
      }
    },
    steps: [
      {
        referenceStart: "#MnuSeguridad",
        response: "Accede al apartado de usuarios.",
        action: () => {
          const mnuSeguridad = document.querySelector<HTMLElement>("#MnuSeguridad");
          mnuSeguridad?.click();
        },
      },
    ],
  },
];

  return (
    <RowComponent>
      <ColComponent
        autoPadding={false}
        responsive={{
          "2xl": open ? 2 : 0,
          xl: open ? 3 : 0,
          lg: open ? 4 : 0,
          md: open ? 4 : 0,
          sm: open ? 12 : 0,
        }}
      >
        {sidebar}
      </ColComponent>
      <ColComponent
        autoPadding={false}

        responsive={{
          "2xl": open ? 10 : 12,
          xl: open ? 9 : 12,
          lg: open ? 8 : 12,
          md: open ? 8 : 12,
          sm: open ? 0 : 12,
        }}
      >
        <CustomTutorial guide={tutorial} />

        {outlet}
      </ColComponent>
    </RowComponent>
  );
};
const Layout: React.FC = () => {
  const { open, toggleOpen } = OpenHook();
  const buttonElement = useMemo(
    () => (
      <Button
        id="btn-menu-sidebar"
        onClick={toggleOpen}
        color="presidencia"
        variant="link"
        size="medium"

      >
        <LuMenu />
      </Button>
    ),
    [toggleOpen]
  );

  return (
    <div className="overflow-x-hidden">
      <HeaderComponent button={buttonElement} />
      <LayoutRenderer
        open={open}
        sidebar={<SidebarComponent />}
        outlet={<Outlet />}
      />
    </div>
  );
};

export default Layout;
