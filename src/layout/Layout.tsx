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

// Definir el tipo de estado para el store de Zustand

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
