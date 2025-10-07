import {
  createRootRoute,
  createRootRouteWithContext,
  createRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import React, { Dispatch, SetStateAction, Suspense } from "react";
import Spinner from "../loading/Loading";
import Users from "../users/Users";
import { UseAuth } from "../extras/useAuth";
import MenuComponent from "../menus/Menus";
import SuppliersComponent from "../catalogues/suppliers/Suppliers";
import CatDepartaments from "../catalogues/departaments/Departaments";
import NotFoundPage from "../error/Error";
import CatTypes from "../catalogues/types/types";
const LazyLayout = React.lazy(() => import("../layout/Layout"));
const LoginComponent = React.lazy(() => import("../auth/login"));
const RequisicionesAdd = React.lazy(() => import("../requisition/Requisition"));

// Ruta principal

export type RouterContext = {
  authentication: {
    navigateTo: boolean; //

    setNavigateTo: Dispatch<SetStateAction<boolean>>;
    signIn: () => void;
    signOut: () => void;
    isLoggedIn: () => boolean;
  };
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),

  errorComponent: () => <NotFoundPage />,
  notFoundComponent: () => <NotFoundPage />,
});
const Layout = createRoute({
  path: "/",
  loader: () => {
    const navigateTo = localStorage.getItem("navigateTo");
    if (navigateTo == "Home") {
      localStorage.setItem("navigateTo", "OK");
let redirectPath = localStorage.getItem("redirect") || "";

// Quita todos los hashes
redirectPath = redirectPath.replace(/#+/g, "");

// Además, si empieza con una / extra, normalízalo
redirectPath = redirectPath.replace(/^\/+/, "/");

console.log("aqui estamos", redirectPath);

return redirect({ to: redirectPath });

    }
  },
  beforeLoad: ({ context: { authentication } }) => {
    if (!authentication.isLoggedIn()) {
      if (window.location.pathname !== "/login") {
        return redirect({ to: "/login" as any });
      }
    }
  },

  getParentRoute: () => Route,
  component: () => (
    <>
      <Suspense fallback={<Spinner />}>
        <LazyLayout />
      </Suspense>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});

const LoginRoute = createRoute({
  path: "/login",
  beforeLoad: ({ context: { authentication } }) => {
    if (authentication.isLoggedIn()) {
      // if (window.location.pathname !== "/MnuSeguridad") {
      return redirect({
        to: localStorage.getItem("redirect")?? undefined,
      });
      // }
    }
  },
  getParentRoute: () => Route,
  component: () => <LoginComponent />,
});
const MnuSeguridadRoute = createRoute({
  path: "/MnuSeguridad",

  getParentRoute: () => Layout,
  component: () => <Users />,
});

const RequisitionRoute = createRoute({
  path: "/MnuRequisiciones",
  getParentRoute: () => Layout,
  component: () => <RequisicionesAdd />,
});

const SuppliersRoute = createRoute({
  path: "/CatProveedores",

  getParentRoute: () => Layout,
  component: () => <SuppliersComponent />, // Implement this component
});
const CatDepartamentos = createRoute({
  path: "/CatDepartamentos",

  getParentRoute: () => Layout,
  component: () => <CatDepartaments />, // Implement this component
});
const CatTipos = createRoute({
  path: "/CatTipos",

  getParentRoute: () => Layout,
  component: () => <CatTypes />, // Implement this component
});
Route.addChildren([Layout, LoginRoute]);
Layout.addChildren([
  MnuSeguridadRoute,
  RequisitionRoute,
  SuppliersRoute,
  CatDepartamentos,
  CatTipos,
]);
