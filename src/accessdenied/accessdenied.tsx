// pages/MaintenancePage.tsx
import React, { useEffect, useState } from "react";
import { FaTools } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { FaSync } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { MdAttachEmail } from "react-icons/md";
import { FaExclamationCircle } from "react-icons/fa";
import { GrUserSettings } from "react-icons/gr";

import Logo from "../../src/assets/logo.png"
const MaintenancePage: React.FC = () => {
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const [lastUpdate, setLastUpdate] = useState("");

  // Crear la fecha de forma segura
  const createDateSafely = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  const fechaLiberacion = null; // Cambiar a null para probar sin fecha
// createDateSafely("2025-11-12T14:40:00");
  const CONFIG = {
    resumeDate: fechaLiberacion,
    typeAdvice: "Inhabilitado" as const,
    pageOrSystem: "Sistema" as const,
    systemTitle: "Sistema Requisiciones" as const,
    governmentEntity: "R. Ayuntamiento de Gómez Palacio" as const,
    cicle: "2025 - 2028" as const,
    messages: {
      main: "Por Cierre Anual. Para más detalle favor de contactarse con el departamento de Adquisiciones." as const,
      soon: "El sistema estará disponible próximamente." as const,
      periodoInactividad: fechaLiberacion
        ? "Del 10 de Diciembre de 2025 al 02 de Enero de 2026"
        : "",
      tipoActualizaciones:
        "Procesos internos del departamento de Adquisciones" as const,
      horarioReanudacion: "Reanudación: 02 de Enero, 09:00 hrs" as const,
    },
    contact: {
      email: "adquisiciones@gomezpalacio.gob.mx" as const,
      telefono: "87 11 75 10 00 ext. 210" as const,
      mesaAyuda: "Soporte: L-V 8:00-16:00 hrs" as const,
    },
    features: {
      showCountdown: true as const,
      enableRefresh: true as const,
      showLastUpdate: true as const,
    },
  };

//   useEffect(() => {
//     if (CONFIG.resumeDate) {
//       const timer = setInterval(() => {
//         updateCountdown();
//       }, 1000);

//       updateCountdown();
//       return () => clearInterval(timer);
//     }
//   }, []);

  useEffect(() => {
    if (CONFIG.features.showLastUpdate) {
      const now = new Date();
      // Opciones seguras para TypeScript
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric" as const,
        month: "long" as const,
        day: "numeric" as const,
        hour: "2-digit" as const,
        minute: "2-digit" as const,
      };

      // Usar toLocaleString en lugar de toLocaleDateString para obtener hora también
      const formattedDate = now.toLocaleString("es-MX", options);
      setLastUpdate(`Última actualización: ${formattedDate} hrs`);
    }
  }, []);

//   const updateCountdown = () => {
//     if (!CONFIG.resumeDate) return;

//     const now = new Date().getTime();
//     const distance = CONFIG.resumeDate.getTime() - now;

//     if (distance < 0) {
//       setCountdown({
//         days: "00",
//         hours: "00",
//         minutes: "00",
//         seconds: "00",
//       });
//       return;
//     }

//     const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//     const hours = Math.floor(
//       (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//     );
//     const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//     setCountdown({
//       days: days.toString().padStart(2, "0"),
//       hours: hours.toString().padStart(2, "0"),
//       minutes: minutes.toString().padStart(2, "0"),
//       seconds: seconds.toString().padStart(2, "0"),
//     });
//   };

  const handleRefresh = () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    window.location.reload();
  };

  // Formatear fecha de reanudación de forma segura
  const getFormattedResumeDate = () => {
    if (!CONFIG.resumeDate) return "";

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long" as const,
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
    };

    // return CONFIG.resumeDate.toLocaleDateString("es-MX", options);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-avenir"
      style={{
        background: "linear-gradient(to bottom right, #B8B6AF, white, #B8B6AF)",
      }}
    >
      {/* Fondo con partículas */}
      <div className="particles-container">
        {[...Array(18)].map((_, i) => {
          const isSecundario = i >= 9;
          const index = i % 9;
          return (
            <div
              key={i}
              className={`particle ${isSecundario ? "secundario" : ""}`}
              style={{
                animationDelay: `${index * 2}s`,
                animationDuration: `${25 + index}s`,
                width: `${5 + index}px`,
                height: `${5 + index}px`,
                left: `${10 + index * 10}%`,
              }}
            />
          );
        })}
      </div>

      {/* Marca de agua con logo */}
      <div className="watermark"></div>

      {/* Formas geométricas flotantes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Contenido principal */}
      <div
        className="max-w-7xl w-full rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          border: "1px solid rgba(184, 182, 175, 0.5)",
        }}
      >
        {/* Barra superior de progreso */}
        <div className="progress-bar"></div>

        {/* Header institucional */}
        <div
          className="p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(to right, #9B2242, #651D32)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-24 h-24 rounded-full -translate-x-12 translate-y-12"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          ></div>

          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg pulse-glow">
                <img
                  src={Logo}
                  alt="Logo Gobierno"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold zapf-font">
                  {CONFIG.systemTitle}
                </h1>
                <p className="text-white/90 font-medium">
                  {CONFIG.governmentEntity}
                </p>
              </div>
            </div>

            <div
              className="rounded-full px-5 py-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <span className="text-white font-semibold flex items-center">
                <FaTools />
                {/* <span>{CONFIG.pageOrSystem}</span> */}
                <span className="uppercase ml-1">{CONFIG.typeAdvice}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna central - Mensaje principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Icono y mensaje de mantenimiento */}
              <div className="text-center mb-8">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 maintenance-icon"
                  style={{
                    background:
                      "linear-gradient(to bottom right, rgba(155, 34, 66, 0.1), rgba(101, 29, 50, 0.1))",
                  }}
                >
                  <FaGears size={50} />
                  {/* <i
                    className="fas fa-cogs text-5xl"
                    style={{ color: "#9B2242" }}
                  ></i> */}
                </div>
                <h2
                  className="text-3xl font-bold mb-4 zapf-font"
                  style={{ color: "#9B2242" }}
                >
                  {CONFIG.pageOrSystem}{" "}
                  <span className="p-2">{CONFIG.typeAdvice}</span>
                </h2>
                <p
                  className="text-xl max-w-2xl mx-auto"
                  style={{ color: "#474C55" }}
                >
                  {CONFIG.messages.main}
                </p>
              </div>

              {/* Información detallada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CONFIG.resumeDate && CONFIG.messages.periodoInactividad && (
                  <div
                    className="rounded-xl p-4 border shadow-sm glow-on-hover transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(to bottom right, white, rgba(184, 182, 175, 0.2))",
                      borderColor: "#B8B6AF",
                    }}
                  >
                    <div className="flex items-start mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                        style={{
                          backgroundColor: "rgba(155, 34, 66, 0.1)",
                        }}
                      >
                        <i
                          className="fas fa-calendar-alt text-xl"
                          style={{ color: "#9B2242" }}
                        ></i>
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-lg mb-1 zapf-font"
                          style={{ color: "#474C55" }}
                        >
                          Período de Inactividad
                        </h3>
                        <p style={{ color: "#727372" }}>
                          {CONFIG.messages.periodoInactividad}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="rounded-xl p-4 border shadow-sm glow-on-hover transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(to bottom right, white, rgba(184, 182, 175, 0.2))",
                    borderColor: "#B8B6AF",
                  }}
                >
                  <div className="flex items-start mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                      style={{
                        backgroundColor: "rgba(155, 34, 66, 0.1)",
                      }}
                    >
                      <FaShieldAlt />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-lg mb-1 zapf-font"
                        style={{ color: "#474C55" }}
                      >
                        Seguridad de Datos
                      </h3>
                      <p style={{ color: "#727372" }}>
                        Toda su información está protegida
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 border shadow-sm glow-on-hover transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(to bottom right, white, rgba(184, 182, 175, 0.2))",
                    borderColor: "#B8B6AF",
                  }}
                >
                  <div className="flex items-start mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                      style={{
                        backgroundColor: "rgba(155, 34, 66, 0.1)",
                      }}
                    >
                      <FaSync />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-lg mb-1 zapf-font"
                        style={{ color: "#474C55" }}
                      >
                        Actualizaciones
                      </h3>
                      <p style={{ color: "#727372" }}>
                        {CONFIG.messages.tipoActualizaciones}
                      </p>
                    </div>
                  </div>
                </div>

                {CONFIG.resumeDate && (
                  <div
                    className="rounded-xl p-4 border shadow-sm glow-on-hover transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(to bottom right, white, rgba(184, 182, 175, 0.2))",
                      borderColor: "#B8B6AF",
                    }}
                  >
                    <div className="flex items-start mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                        style={{
                          backgroundColor: "rgba(155, 34, 66, 0.1)",
                        }}
                      >
                        <i
                          className="fas fa-clock text-xl"
                          style={{ color: "#9B2242" }}
                        ></i>
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-lg mb-1 zapf-font"
                          style={{ color: "#474C55" }}
                        >
                          Horario de Servicio
                        </h3>
                        <p style={{ color: "#727372" }}>
                          {CONFIG.messages.horarioReanudacion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contacto de emergencia */}
              <div
                className="rounded-xl p-4 border mt-6 glow-on-hover"
                style={{
                  background:
                    "linear-gradient(to right, rgba(155, 34, 66, 0.05), rgba(101, 29, 50, 0.05))",
                  borderColor: "rgba(155, 34, 66, 0.2)",
                }}
              >
                <h3
                  className="font-semibold text-xl mb-4 flex items-center zapf-font"
                  style={{ color: "#9B2242" }}
                >
                  <GrUserSettings size={20} className="mr-2" />
                  Contactos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <MdAttachEmail size={25} className="mr-2" />
                    <span className="text-wrap" style={{ color: "#474C55" }}>
                      {CONFIG.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MdPhone size={25} className="mr-2" />

                    <span style={{ color: "#474C55" }}>
                      {CONFIG.contact.telefono}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaExclamationCircle size={25} className="mr-2" />
                    <span style={{ color: "#474C55" }}>
                      {CONFIG.contact.mesaAyuda}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Información destacada */}
            <div className="space-y-6">
              {/* Contador de tiempo o mensaje alternativo */}
              <div
                className="rounded-2xl p-6 text-white shadow-xl pulse-glow"
                style={{
                  background:
                    "linear-gradient(to bottom right, #9B2242, #651D32)",
                }}
              >
                <div className="text-center mb-2">
                  <i className="fas fa-rocket text-3xl mb-2 text-white/80"></i>
                  <h3 className="font-bold text-xl mb-2 zapf-font">
                    {CONFIG.resumeDate ? "Reanudación en" : ""}
                  </h3>
                  {CONFIG.resumeDate && (
                    <p className="text-white/90">{getFormattedResumeDate()}</p>
                  )}
                </div>

                {CONFIG.resumeDate ? (
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div
                      className="rounded-lg p-3 text-center"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="text-2xl font-bold">{countdown.days}</div>
                      <div className="text-xs opacity-80">Días</div>
                    </div>
                    <div
                      className="rounded-lg p-3 text-center"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="text-2xl font-bold">
                        {countdown.hours}
                      </div>
                      <div className="text-xs opacity-80">Horas</div>
                    </div>
                    <div
                      className="rounded-lg p-3 text-center"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="text-2xl font-bold">
                        {countdown.minutes}
                      </div>
                      <div className="text-xs opacity-80">Minutos</div>
                    </div>
                    <div
                      className="rounded-lg p-3 text-center"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="text-2xl font-bold">
                        {countdown.seconds}
                      </div>
                      <div className="text-xs opacity-80">Segundos</div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 soon-message">
                    <i className="fas fa-hourglass-half text-4xl mb-4 text-white/80"></i>
                    <h4 className="font-bold text-lg mb-2 zapf-font">
                      Próximamente
                    </h4>
                    <p className="text-white/90">{CONFIG.messages.soon}</p>
                  </div>
                )}

                <button
                  onClick={handleRefresh}
                  className="w-full bg-white font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center glow-on-hover"
                  style={{ color: "#9B2242" }}
                >
                  <i className="fas fa-redo-alt mr-2"></i>
                  Actualizar Página
                </button>
              </div>

              {/* Logo institucional */}
              <a
                href="https://gomezpalacio.gob.mx"
                className="bg-white rounded-xl p-4 border shadow-sm flex flex-col items-center glow-on-hover"
                style={{ borderColor: "#B8B6AF" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p
                  className="text-center text-sm pb-2 zapf-font"
                  style={{ color: "#727372" }}
                >
                  Enlace a la pagina principal
                </p>
                <img
                  src={Logo}
                  alt="Logo Gobierno"
                  className="h-12 object-contain mb-1"
                />
                <p
                  className="text-center text-sm zapf-font"
                  style={{ color: "#727372" }}
                >
                  {CONFIG.governmentEntity}
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-5 text-center"
          style={{ backgroundColor: "#474C55", color: "white" }}
        >
          <div className="max-w-4xl mx-auto">
            <p className="font-medium mb-1">
              <strong>
                Dirección de Centro de Tecnologías Informáticas y Comunicación
              </strong>
            </p>
            <p className="text-sm opacity-90 mb-2">
              © {CONFIG.cicle} {CONFIG.governmentEntity}
            </p>
            {CONFIG.features.showLastUpdate && lastUpdate && (
              <p className="text-xs opacity-70">{lastUpdate}</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @font-face {
          font-family: "Zapf Humanist 601 BT";
          src: url("data:font/woff2;base64,") format("woff2");
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        .zapf-font {
          font-family: "Zapf Humanist 601 BT", Georgia, serif;
        }

        .upperCase {
          text-transform: uppercase;
        }

        .text-wrap {
          text-wrap: initial;
          word-break: break-all;
          text-wrap-mode: wrap;
        }

        /* Fondo con partículas animadas */
        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -2;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float-up linear infinite;
        }

        .particle:nth-child(1) {
          width: 8px;
          height: 8px;
          left: 10%;
          animation-duration: 25s;
          animation-delay: 0s;
          background: #9b2242;
        }
        .particle:nth-child(2) {
          width: 12px;
          height: 12px;
          left: 20%;
          animation-duration: 30s;
          animation-delay: 2s;
          background: #9b2242;
        }
        .particle:nth-child(3) {
          width: 6px;
          height: 6px;
          left: 30%;
          animation-duration: 20s;
          animation-delay: 4s;
          background: #9b2242;
        }
        .particle:nth-child(4) {
          width: 10px;
          height: 10px;
          left: 40%;
          animation-duration: 35s;
          animation-delay: 1s;
          background: #9b2242;
        }
        .particle:nth-child(5) {
          width: 7px;
          height: 7px;
          left: 50%;
          animation-duration: 28s;
          animation-delay: 3s;
          background: #9b2242;
        }
        .particle:nth-child(6) {
          width: 9px;
          height: 9px;
          left: 60%;
          animation-duration: 32s;
          animation-delay: 5s;
          background: #9b2242;
        }
        .particle:nth-child(7) {
          width: 11px;
          height: 11px;
          left: 70%;
          animation-duration: 26s;
          animation-delay: 2s;
          background: #9b2242;
        }
        .particle:nth-child(8) {
          width: 5px;
          height: 5px;
          left: 80%;
          animation-duration: 22s;
          animation-delay: 6s;
          background: #9b2242;
        }
        .particle:nth-child(9) {
          width: 13px;
          height: 13px;
          left: 90%;
          animation-duration: 29s;
          animation-delay: 1s;
          background: #9b2242;
        }

        /* Partículas secundarias */
        .particle.secundario {
          background: #651d32;
        }

        .particle.secundario:nth-child(10) {
          width: 9px;
          height: 9px;
          left: 15%;
          animation-duration: 27s;
          animation-delay: 7s;
        }
        .particle.secundario:nth-child(11) {
          width: 6px;
          height: 6px;
          left: 25%;
          animation-duration: 31s;
          animation-delay: 3s;
        }
        .particle.secundario:nth-child(12) {
          width: 11px;
          height: 11px;
          left: 35%;
          animation-duration: 24s;
          animation-delay: 8s;
        }
        .particle.secundario:nth-child(13) {
          width: 8px;
          height: 8px;
          left: 45%;
          animation-duration: 33s;
          animation-delay: 4s;
        }
        .particle.secundario:nth-child(14) {
          width: 7px;
          height: 7px;
          left: 55%;
          animation-duration: 26s;
          animation-delay: 9s;
        }
        .particle.secundario:nth-child(15) {
          width: 10px;
          height: 10px;
          left: 65%;
          animation-duration: 29s;
          animation-delay: 5s;
        }
        .particle.secundario:nth-child(16) {
          width: 5px;
          height: 5px;
          left: 75%;
          animation-duration: 21s;
          animation-delay: 10s;
        }
        .particle.secundario:nth-child(17) {
          width: 12px;
          height: 12px;
          left: 85%;
          animation-duration: 34s;
          animation-delay: 6s;
        }
        .particle.secundario:nth-child(18) {
          width: 8px;
          height: 8px;
          left: 95%;
          animation-duration: 28s;
          animation-delay: 11s;
        }

        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Marca de agua con logo */
        .watermark {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("/logo.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 40%;
          opacity: 1;
          z-index: -1;
          pointer-events: none;
        }

        /* Formas geométricas flotantes */
        .floating-shapes {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          opacity: 0.05;
          animation: float-shapes 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          background: #9b2242;
          border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%;
          top: 15%;
          left: 8%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          background: #651d32;
          border-radius: 50%;
          top: 65%;
          right: 12%;
          animation-delay: 5s;
        }

        .shape-3 {
          width: 120px;
          height: 120px;
          background: #474c55;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          bottom: 25%;
          left: 18%;
          animation-delay: 10s;
        }

        .shape-4 {
          width: 180px;
          height: 180px;
          background: #727372;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          top: 30%;
          right: 20%;
          animation-delay: 15s;
        }

        @keyframes float-shapes {
          0%,
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-20px) rotate(5deg) scale(1.05);
          }
          50% {
            transform: translateY(10px) rotate(-3deg) scale(0.95);
          }
          75% {
            transform: translateY(-15px) rotate(2deg) scale(1.02);
          }
        }

        .pulse-glow {
          animation: pulse-glow 2s infinite alternate;
        }

        @keyframes pulse-glow {
          from {
            box-shadow: 0 0 10px rgba(155, 34, 66, 0.3);
          }
          to {
            box-shadow: 0 0 25px rgba(155, 34, 66, 0.6);
          }
        }

        .gradient-border {
          background: linear-gradient(
            90deg,
            #9b2242,
            #651d32,
            #9b2242
          );
          background-size: 200% 100%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .maintenance-icon {
          animation: maintenance-spin 8s linear infinite;
        }

        @keyframes maintenance-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .progress-bar {
          height: 6px;
          background: linear-gradient(
            90deg,
            #9b2242,
            #651d32
          );
          background-size: 200% 100%;
          animation: gradient-shift 2s ease infinite,
            progress-grow 3s ease-in-out infinite alternate;
        }

        @keyframes progress-grow {
          0% {
            width: 30%;
          }
          100% {
            width: 70%;
          }
        }

        /* Efecto de brillo sutil en hover */
        .glow-on-hover {
          transition: all 0.3s ease;
        }

        .glow-on-hover:hover {
          box-shadow: 0 0 15px rgba(155, 34, 66, 0.2);
        }

        .soon-message {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
