import React, { useEffect, useRef, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import Observable from "../../extras/observable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../assets/logo-gpd.png";
type PdfRequisitionType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filePath?: string;
};
const tw = createTw({});

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

const PdfRequisition: React.FC<PdfRequisitionType> = ({
  open,
  setOpen,
  filePath,
}) => {
  const data = Observable().ObservableGet("PdfRequisicion");

  useEffect(() => {
    // Aquí puedes manejar la lógica de la solicitud de datos
  }, []);

  return (
    <ModalComponent title="Requisición" open={open} setOpen={setOpen}>
      <PDFViewer width="100%" height="100%">
        <Document>
          <Page
            size="A4"
            orientation="landscape"
            style={{
              ...styles.page,
              ...tw("w-full flex flex-col bg-white p-6"),
            }}
          >
            <View
              style={tw(
                "w-full flex flex-col items-center bg-blue-100 rounded-lg p-4 mb-6 shadow-lg"
              )}
            >
              <Image src={Logo} style={tw("h-28 w-96")} />
              <Text
                style={tw(
                  "text-3xl font-bold text-blue-800 mt-12 text-center mb-1"
                )}
              >
                R. AYUNTAMIENTO DE GOMEZ PALACIO, DGO 2022-2025
              </Text>
            </View>

            <View style={tw("w-full flex flex-row -gap6")}>
              <View
                style={tw(
                  "w-1/2 bg-white rounded-xl shadow-md overflow-hidden"
                )}
              >
                <View style={tw("bg-blue-100 p-4")}>
                  <Text
                    style={tw("text-xl font-bold text-blue-800 text-center")}
                  >
                    Detalles de la Requisición
                  </Text>
                </View>
                <View style={tw("p-4")}>
                  {[
                    {
                      label: "Fecha de impresión",
                      value: ` ${new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}`,
                    },
                    {
                      label: "IdRequisición",
                      value: data?.data?.pdfData?.IDRequisicion,
                    },

                    {
                      label: "Centro de Costos",
                      value: data?.data?.pdfData?.Nombre_CC,
                    },
                    { label: "Aplicación", value: "" },
                    {
                      label: "Fecha de asignación",
                      value: `
                      ${new Date(data?.data?.pdfData?.FechaAsignacion).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}`,
                    },
                  ].map((item, index) => (
                    <View
                      key={index}
                      style={tw(
                        `flex flex-row justify-between py-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`
                      )}
                    >
                      <Text
                        style={tw("text-sm font-semibold text-gray-600 w-1/2")}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={tw(
                          "text-sm text-gray-800 font-bold text-right w-1/2"
                        )}
                      >
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
                <View
                  style={tw("bg-white rounded-xl shadow-md overflow-hidden")}
                >
              <View break>
              <View wrap style={tw("bg-blue-100 p-4")}>
                    <Text
                      style={tw("text-xl font-bold text-blue-800 text-center")}
                    >
                      Detalle de Productos
                    </Text>
                  </View>
                  <View  style={tw("p-4")}>
                    <View
                      style={tw(
                        "flex flex-row mb-2 pb-2 border-b border-gray-200"
                      )}
                    >
                      <Text style={tw("w-1/4 text-sm font-bold text-gray-600")}>
                        Cantidad
                      </Text>
                      <Text style={tw("w-1/2 text-sm font-bold text-gray-600")}>
                        Descripción
                      </Text>
                      <Text
                        style={tw(
                          "w-1/4 text-sm font-bold text-gray-600 text-right"
                        )}
                      >
                        {/* Clave */}
                      </Text>
                    </View>
                    {data?.data?.products &&
                      data.data.products.map((producto, index) => (
                        <View
                          key={index}
                          style={tw(
                            `flex flex-row py-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`
                          )}
                        >
                          <Text
                            style={tw(
                              "w-1/4 text-sm text-gray-800 text-center text-wrap"
                            )}
                          >
                            {producto.Cantidad}
                          </Text>
                          <Text
                            style={tw("w-1/2 text-sm text-gray-800 text-wrap")}
                          >
                            {producto.Descripcion}
                          </Text>
                          <Text
                            style={tw("w-1/4 text-sm text-gray-800 text-right")}
                          >
                            {producto.ClavePresupestal}
                          </Text>
                        </View>
                      ))}
                    <View style={tw("flex flex-row justify-between py-3")}>
                      <Text
                        style={tw("text-sm font-semibold text-gray-600 w-1/2")}
                      >
                        Observaciones:
                      </Text>
                      <Text
                        style={tw(
                          "text-sm text-gray-800 font-bold text-right w-1/2"
                        )}
                      >
                        {data.data.pdfData.Observaciones}
                      </Text>
                    </View>
                  </View>
              </View>
                </View>
              </View>
              <View
                style={tw(
                  "w-1/2 bg-white rounded-xl  overflow-hidden"
                )}
              >
                <View wrap style={tw("bg-blue-100 p-4")}>
                  <Text
                    style={tw("text-xl font-bold text-blue-800 text-center")}
                  >
                    Información de Proveedores por Producto
                  </Text>
                </View>

                {data?.data?.products.map((producto, prodIndex) => (
                  <View
                    wrap
                    key={prodIndex}
                    style={tw("p-4 border-b border-gray-200")}
                  >
                    <View
                    
                    style={tw("flex flex-row flex-wrap justify-between mb-2")}
                    >
                      <Text style={tw("text-base font-bold text-gray-800")}>
                        Producto:
                      </Text>
                      <Text style={tw("text-sm text-gray-600 ml-2")}>
                        {producto.Descripcion}
                      </Text>
                    </View>
                    <View

                      style={tw("flex flex-row flex-wrap justify-between mb-2")}
                    >
                      <Text style={tw("text-base font-bold text-gray-800")}>
                        Cantidad:
                      </Text>
                      <Text style={tw("text-sm text-gray-600 ml-2")}>
                        {producto.Cantidad}
                      </Text>
                    </View>
                    <View style={tw("bg-gray-50 rounded p-3 mb-2")}>
                      {/* Header row */}
                      <View style={tw("bg-gray-50 rounded p-4 mb-4")}>
                        {/* Header row with better contrast */}
                        <View
                          style={tw(
                            "flex flex-row justify-between py-2 border-b border-gray-300"
                          )}
                        >
                          <Text
                            style={tw(
                              "w-1/5 text-sm font-medium text-gray-700 text-center"
                            )}
                          >
                            Proveedor
                          </Text>
                          <Text
                            style={tw(
                              "w-1/5 text-sm font-medium text-gray-700 text-right"
                            )}
                          >
                            Precio
                          </Text>
                          <Text
                            style={tw(
                              "w-1/5 text-sm font-medium text-gray-700 text-right"
                            )}
                          >
                            IVA
                          </Text>
                          <Text
                            style={tw(
                              "w-1/5 text-sm font-medium text-gray-700 text-right"
                            )}
                          >
                            Precio con IVA
                          </Text>
                          <Text
                            style={tw(
                              "w-1/5 text-sm font-medium text-gray-700 text-right"
                            )}
                          >
                            Retenciones
                          </Text>
                        </View>

                        {/* Productos with better row styling */}
                        {["Proveedor1", "Proveedor2", "Proveedor3"].map(
                          (key, index) => {
                            const selected =
                              producto[`seleccionado${index + 1}`]; // Ejemplo: seleccionado1, seleccionado2, etc.
                            const rowStyle =
                              producto.Proveedor ==
                              producto[`Proveedor${index + 1}`]
                                ? "bg-lime-100"
                                : "bg-white";

                            return (
                              <View
                              wrap
                                key={index}
                                style={tw(
                                  `flex flex-row justify-between py-2 ${rowStyle} border-b border-gray-200 `
                                )}
                              >
                                <Text
                                  style={tw(
                                    "w-1/5 text-xs text-gray-700 text-center"
                                  )}
                                >
                                  {producto[`Proveedor${index + 1}`]}
                                </Text>
                                <Text
                                  style={tw(
                                    "w-1/5 text-sm text-gray-700 text-right"
                                  )}
                                >
                                  {producto[`PrecioUnitarioSinIva${index + 1}`]}
                                </Text>
                                <Text
                                  style={tw(
                                    "w-1/5 text-sm text-gray-700 text-right"
                                  )}
                                >
                                  {producto[`ImporteIva${index + 1}`]}
                                </Text>
                                <Text
                                  style={tw(
                                    "w-1/5 text-sm text-gray-700 text-right"
                                  )}
                                >
                                  {producto[`PrecioUnitarioConIva${index + 1}`]}
                                </Text>
                                <Text
                                  style={tw(
                                    "w-1/5 text-sm text-gray-700 text-right"
                                  )}
                                >
                                  {producto[`Retenciones${index + 1}`]}
                                </Text>

                                {selected && (
                                  <Text
                                    style={tw(
                                      "absolute right-2 text-green-500 font-bold text-sm"
                                    )}
                                  >
                                    Seleccionado
                                  </Text>
                                )}
                              </View>
                            );
                          }
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>

           
            </View>
            <View style={tw("w-full flex flex-row -gap6  mt-10")}>

              {/* Primera firma */}
              <View style={tw("w-1/2 flex items-center bg-white")}>
                {/* {data?.data?.status !="CP" && (
                  ARREGLA CON FOTOS DE LAS FIRMAS
               <Image cache  src={`${import.meta.env.VITE_API_IMG}/${data?.data?.products[0]?.Firma_Director}`} debug/>
                )} */}
                <Text
                  style={tw(
                    "text-sm font-medium text-gray-700 text-center mb-2"
                  )}
                  >

                  Firma Representante ({data?.data?.products[0]?.Nombre_Director})
                </Text>
                <View style={tw("w-4/5 h-12 border-b border-gray-500")} />
              </View>

              {/* Segunda firma */}
              <View style={tw("w-1/2 flex items-center bg-white")}>
                <Text
                  style={tw(
                    "text-sm font-medium text-gray-700 text-center mb-2"
                  )}
                >
                  Firma Autorización
                </Text>
                <View style={tw("w-4/5 h-12 border-b border-gray-500")} />
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </ModalComponent>
  );
};

export default PdfRequisition;
