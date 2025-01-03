import { createRootRoute, createRootRouteWithContext, createRoute, Link, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import React, { Suspense } from "react";
import Spinner from "../loading/Loading";
import Users from "../users/Users";
import { UseAuth } from "../extras/useAuth";
import MenuComponent from "../menus/Menus";
import SuppliersComponent from "../catalogues/suppliers/Suppliers";
const LazyLayout = React.lazy(() => import("../layout/Layout"));
const LoginComponent = React.lazy(() => import("../auth/login"));
const RequisicionesAdd = React.lazy(() => import("../requisition/Requisition"));

// Ruta principal


export type RouterContext = {
  authentication: {
    signIn :()=>void,
    signOut :()=>void,
    isLoggedIn :()=>boolean
  }
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Suspense fallback={<Spinner />}>
        <Outlet/>
      </Suspense>
      <TanStackRouterDevtools />
    </>
  ),

  errorComponent: () => (
    <>Oops! Algo salió mal.</>
  ),
  notFoundComponent: () =>(
    <>no se encontro el componente</>
  )
  
});
const Layout = createRoute({
  path: "/",
  
  beforeLoad: ({ context: { authentication } }) => {
    if (!authentication.isLoggedIn()) {
      if (window.location.pathname !== "/login") {
        return redirect({ to: "/login" });
      }
    }
    
  },
  
  getParentRoute: () => Route, 
  component: () => (
    <>
      <Suspense fallback={<Spinner />} >
        <LazyLayout />
      </Suspense>
      <TanStackRouterDevtools />
    </>
  ),
});

const LoginRoute = createRoute({
  path: "/login",
  beforeLoad: ({ context: { authentication } }) => {
    if (authentication.isLoggedIn()) {
    
      if (window.location.pathname !== "/MnuSeguridad") {
        return redirect({ to: "/MnuSeguridad" });
      }
    }
  },
  getParentRoute: () => Route, 
  component: () => <LoginComponent/>, 
});
const MnuSeguridadRoute = createRoute({
  path: "/MnuSeguridad",

  getParentRoute: () => Layout, 
  component: () => <Users/>, 
});

const RequisitionRoute = createRoute({
  path: "/MnuRequisiciones",
  getParentRoute: () =>Layout,
  component: () => <RequisicionesAdd/>,

});

const SuppliersRoute = createRoute({
  path: "/CatProveedores",

  getParentRoute: () => Layout, 
  component: () => <SuppliersComponent/>,  // Implement this component
});

Route.addChildren([Layout,LoginRoute]);
Layout.addChildren([MnuSeguridadRoute,RequisitionRoute,SuppliersRoute])