import { Dispatch, SetStateAction, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { routeTree } from "./routeTree.gen";
import {
  RouterProvider,
  createRootRouteWithContext,
  createRouter,
} from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route } from "./routes/__root";
import { AuthContext, UseAuth } from "./extras/useAuth";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
type RouterContext = {
  authentication: typeof UseAuth; // Usa `typeof` para capturar el tipo
};
export type context = {
  authentication: {
    navigateTo:boolean; //
    setNavigateTo:Dispatch<SetStateAction<boolean>>
    signIn: () => void;
    signOut: () => void;
  };
};

const router = createRouter({
  routeTree: Route,
  context: { authentication: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,

    },
  },
});
function Requisiciones() {
  useEffect(() => {
    const handleBeforeUnload = (event:any) => {
      console.log("El usuario está saliendo del sitio.");
      localStorage.setItem("navigateTo","Home");
      // event.preventDefault();
      // event.returnValue = "¿Estás seguro de que quieres salir?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const authentication = UseAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{ authentication }}
      ></RouterProvider>
    </QueryClientProvider>
  );
}

export default Requisiciones;
