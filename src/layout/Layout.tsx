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
