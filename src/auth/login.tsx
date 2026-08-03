import { useMutation } from "@tanstack/react-query";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AxiosRequest } from "../axios/Axios";
import { showToast } from "../sweetalert/Sweetalert";
import Escudo from "../assets/logo.png";
const LoginComponent = () => {
  // 1. LÓGICA DE MUTACIÓN (Se mantiene intacta)
  const mutation = useMutation({
    mutationFn: ({
      url,
      method,
      data,
    }: {
      url: string;
      method: "POST" | "PUT" | "DELETE";
      data?: any;
    }) => AxiosRequest(url, method, data),
    onSuccess: (data) => {
      if (data?.data && data?.data?.redirect == "/") {
        showToast("No cuentas con permisos", "question");
        return;
      }
      if (data?.data) {
        if (!data?.data?.continue) {
          window.location.href = data.data.redirect;
          return;
        }
        localStorage.setItem("permisos", JSON.stringify(data.data.permisos));
        localStorage.setItem(
          "menuPermiso",
          JSON.stringify(data.data.menuPermiso),
        );
        localStorage.setItem("group", JSON.stringify(data.data.group));
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("name", data.data.name);
        localStorage.setItem("role", data.data.role);
        localStorage.setItem("centro_costo", data.data.centro_costo);
        localStorage.setItem("redirect", data.data.redirect);
        window.location.href = data.data.redirect;
      }
      showToast(data.message, data.status);
    },
    onError: (error: any) => {
      console.log(error);
      showToast(error?.message || "Error al realizar la acción", "error");
    },
  });

  // 2. ESQUEMA DE VALIDACIÓN (Se mantiene)
  const validationSchema = Yup.object({
    Usuario: Yup.string().required("El usuario es obligatorio"),
    Password: Yup.string().required("La contraseña es requerida"),
  });

  // 3. UI MEJORADA CON PALETA GUINDA
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#B8B6AF] via-gray-100 to-white relative overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#9B2242] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#651D32] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#474C55] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Panel Izquierdo: Branding elegante */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#9B2242] via-[#651D32] to-[#474C55] p-12 flex-col justify-between relative overflow-hidden">
        {/* Patrón decorativo superior */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        {/* Patrón de cuadrícula decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="border border-white/20"></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1">
          {/* Logo profesional placeholder - AQUÍ CAMBIAS POR TU LOGO */}
          <div className="mb-12">
            <div className="relative group">
              {/* Círculo de fondo con animación */}
              <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>

              {/* Logo SVG profesional */}
              <div className="relative w-40 h-40 rounded-3xl shadow-2xl flex items-center justify-center backdrop-blur-sm  group-hover:scale-105 transition-transform duration-300">
                {/* Reemplaza este SVG con tu logo real usando: <img src="/ruta-a-tu-logo.png" alt="Logo" className="w-36 h-36 object-contain" /> */}
                <img src={Escudo} />
              </div>

              {/* Decoración adicional - anillos */}
              <div className="absolute -inset-4 border-2 border-white/20 rounded-full animate-ping-slow"></div>
              <div className="absolute -inset-8 border border-white/10 rounded-full"></div>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-6xl font-bold text-white leading-tight text-center mb-4">
            Requisiciones
          </h1>

          {/* Línea decorativa */}
          <div className="w-24 h-1 bg-white/30 rounded-full"></div>
        </div>

        {/* Footer con versión */}
        <div className="relative z-10 text-white/60 text-sm flex items-center justify-between">
          <span>Versión {import.meta.env.VITE_VERSION || "1.0.0"}</span>
        </div>
      </div>

      {/* Panel Derecho: Formulario de Login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Card del formulario con glassmorphism sutil */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
            {/* Header del formulario */}
            <div className="text-center mb-8">
              {/* Logo móvil - versión simplificada */}
              <div className="md:hidden w-16 h-16 bg-gradient-to-br from-[#9B2242] to-[#651D32] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="70"
                    y="60"
                    width="60"
                    height="80"
                    rx="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                  />
                  <line
                    x1="80"
                    y1="80"
                    x2="120"
                    y2="80"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="80"
                    y1="100"
                    x2="120"
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="125" r="12" fill="currentColor" />
                  <path
                    d="M95 125L98 128L105 121"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-[#130D0E] mb-2">
                Bienvenido de nuevo
              </h2>
              <p className="text-[#727372] text-sm">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Formulario con Formik */}
            <Formik
              initialValues={{ Usuario: "", Password: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                mutation.mutate({
                  url: `/auth/login`,
                  method: "POST",
                  data: values,
                });
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Campo: Usuario */}
                  <div>
                    <label
                      htmlFor="Usuario"
                      className="block text-sm font-semibold text-[#474C55] mb-2"
                    >
                      Usuario
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-[#727372]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <Field
                        type="text"
                        id="Usuario"
                        name="Usuario"
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-[#B8B6AF] rounded-xl focus:ring-2 focus:ring-[#9B2242] focus:border-[#9B2242] outline-none transition-all text-[#130D0E] placeholder-[#727372]"
                        placeholder="Ingresa tu usuario"
                        autoComplete="username"
                      />
                    </div>
                    <ErrorMessage
                      name="Usuario"
                      component="div"
                      className="text-[#9B2242] text-xs mt-1.5 font-medium"
                    />
                  </div>

                  {/* Campo: Contraseña */}
                  <div>
                    <label
                      htmlFor="Password"
                      className="block text-sm font-semibold text-[#474C55] mb-2"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-[#727372]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <Field
                        type="password"
                        id="Password"
                        name="Password"
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-[#B8B6AF] rounded-xl focus:ring-2 focus:ring-[#9B2242] focus:border-[#9B2242] outline-none transition-all text-[#130D0E] placeholder-[#727372]"
                        placeholder="Ingresa tu contraseña"
                        autoComplete="current-password"
                      />
                    </div>
                    <ErrorMessage
                      name="Password"
                      component="div"
                      className="text-[#9B2242] text-xs mt-1.5 font-medium"
                    />
                  </div>

                  {/* Botón de envío */}
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full mt-6 bg-gradient-to-r from-[#9B2242] via-[#651D32] to-[#474C55] text-white font-semibold py-4 px-6 rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-[#9B2242]/30 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 relative overflow-hidden group"
                  >
                    {/* Efecto de brillo al hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                    {mutation.isPending ? (
                      <span className="flex items-center justify-center relative z-10">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Iniciando sesión...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Iniciar sesión
                      
                      </span>
                    )}
                  </button>
                </form>
              )}
            </Formik>
          </div>

          {/* Branding móvil */}
          <div className="mt-8 md:hidden text-center">
            <h3 className="text-xl font-bold text-[#130D0E] mb-2">
              Requisiciones
            </h3>
            <p className="text-xs text-[#727372] mt-4">
              Versión {import.meta.env.VITE_VERSION || "1.0.0"}
            </p>
          </div>
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginComponent;
