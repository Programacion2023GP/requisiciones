import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Pruebitas } from "./Pruebitas";

// import './index.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
   <Pruebitas/>
  </StrictMode>
);
