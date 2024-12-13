import React, { useState } from "react";
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
// import { PDFViewer } from '@react-pdf/renderer';
import ReactPDF from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

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
  return (
    <ModalComponent title="Requisición" open={open} setOpen={setOpen}>
      {/* <div className="container mx-auto p-5"> */}
      <PDFViewer width={"100%"} height={"600px"}>
        <Document>
          <Page
            size="A4"
            orientation="landscape"
            style={{
              ...styles.page,
              ...tw("w-full flex flex-col bg-gray-50 p-6"),
            }}
          >
            {/* Header Corporativo */}
            <View
              style={tw(
                "w-full flex flex-col items-center bg-blue-100 rounded-lg p-4 mb-6 shadow-lg"
              )}
            >
              {/* Imagen de la empresa */}
              <Image

                src="https://static-cse.canva.com/blob/951803/2650logotiposqueteinspiraran.jpg" // Cambia esta ruta a la URL o ubicación de tu imagen
                style={tw("w-24 h-24 rounded-full mb-2")} // Ajusta el tamaño y estilo de la imagen
              />

              <Text
                style={tw("text-3xl font-bold text-blue-800 text-center mb-1")}
              >
               R. AYUNTAMIENTO DE GOMEZ PALACIO, DGO 2022-2025

              </Text>
           
            </View>

            {/* Contenido Principal */}
            <View style={tw("w-full flex flex-row gap-6")}>
              {/* Sección de Detalles de Requisición */}
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
                    { label: "Fecha de impresión", value: "REQ-2024-0001" },
                    { label: "IdRequisición", value: "13/12/2024" },
                    { label: "Centro de Costos", value: "DEPT-COMPRAS" },
                    { label: "Aplicación", value: "María González" },
                    {
                      label: "Fecha de asignación",
                      value: "Equipamiento Tecnológico",
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
                  <View style={tw("bg-blue-100 p-4")}>
                    <Text
                      style={tw("text-xl font-bold text-blue-800 text-center")}
                    >
                      Detalle de Productos
                    </Text>
                  </View>

                  <View wrap style={tw("p-4")}>
                    {/* Encabezados */}
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
                        Clave
                      </Text>
                    </View>

                    {/* Filas de Productos */}
                    {[
                      {
                        cantidad: 2,
                        descripcion: "Laptop Profesional de Alto Rendimiento",
                        clave: "TECH-LP-001",
                      },
                      {
                        cantidad: 1,
                        descripcion: "Monitor 4K Ultrawide",
                        clave: "DISP-MON-004",
                      },
                      {
                        cantidad: 3,
                        descripcion: "Teclado Ergonómico Inalámbrico",
                        clave: "ACC-KBD-002",
                      },
                    ].map((producto, index) => (
                      <View
                        key={index}
                        style={tw(
                          `flex flex-row py-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`
                        )}
                      >
                        <Text
                          style={tw("w-1/4 text-sm text-gray-800 text-center")}
                        >
                          {producto.cantidad}
                        </Text>
                        <Text style={tw("w-1/2 text-sm text-gray-800")}>
                          {producto.descripcion}
                        </Text>
                        <Text
                          style={tw("w-1/4 text-sm text-gray-800 text-right")}
                        >
                          {producto.clave}
                        </Text>
                      </View>
                    ))}
                    <View style={tw(`flex flex-row justify-between py-3 `)}>
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
                        aqui
                      </Text>
                    </View>
                    {/* Total */}
                    <View
                      style={tw(
                        "mt-4 pt-4 border-t border-gray-200 flex flex-row justify-between"
                      )}
                    >
                      <Text style={tw("text-sm font-bold text-gray-800")}>
                        Total de Productos
                      </Text>
                      <Text style={tw("text-sm font-bold text-blue-800")}>
                        6 Unidades
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Sección de Proveedores */}
              <View
                style={tw(
                  "w-1/2 bg-white rounded-xl shadow-md overflow-hidden"
                )}
              >
                <View wrap style={tw("bg-blue-100 p-4")}>
                  <Text
                    style={tw("text-xl font-bold text-blue-800 text-center")}
                  >
                    Información de Proveedores
                  </Text>
                </View>

                {[
                  {
                    nombre: "TechProveedores S.A.",
                    productos: [
                      {
                        descripcion: "Laptop Profesional",
                        cantidad: 2,
                        precioUnitario: "$1,500.00",
                        total: "$3,000.00",
                      },
                    ],
                    contacto: "Juan Pérez",
                    telefono: "(55) 9876-5432",
                  },
                  {
                    nombre: "Displays México",
                    productos: [
                      {
                        descripcion: "Monitor 4K",
                        cantidad: 1,
                        precioUnitario: "$450.00",
                        total: "$450.00",
                      },
                    ],
                    contacto: "Ana Rodríguez",
                    telefono: "(55) 1122-3344",
                  },
                  {
                    nombre: "Accesorios Ergonómicos",
                    productos: [
                      {
                        descripcion: "Teclado Ergonómico",
                        cantidad: 3,
                        precioUnitario: "$120.00",
                        total: "$360.00",
                      },
                    ],
                    contacto: "Carlos Sánchez",
                    telefono: "(55) 5555-7777",
                  },
                ].map((proveedor, provIndex) => (
                  <View
                    wrap
                    key={provIndex}
                    style={tw("p-4 border-b border-gray-200")}
                  >
                    <View style={tw("flex flex-row justify-between mb-2")}>
                      <Text style={tw("text-base font-bold text-gray-800")}>
                        {proveedor.nombre}
                      </Text>
                      <Text style={tw("text-sm text-gray-600")}>
                        {proveedor.contacto}
                      </Text>
                    </View>

                    <View style={tw("bg-gray-50 rounded p-3 mb-2")}>
                      {proveedor.productos.map((producto, prodIndex) => (
                        <View
                          key={prodIndex}
                          style={tw("flex flex-row justify-between py-2")}
                        >
                          <Text style={tw("w-1/2 text-sm text-gray-700")}>
                            {producto.descripcion}
                          </Text>
                          <Text
                            style={tw(
                              "w-1/4 text-sm text-gray-700 text-center"
                            )}
                          >
                            {producto.cantidad}
                          </Text>
                          <Text
                            style={tw("w-1/4 text-sm text-gray-700 text-right")}
                          >
                            {producto.total}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Text style={tw("text-sm text-gray-600")}>
                      {proveedor.telefono}
                    </Text>
                  </View>
                ))}

                <View
                  style={tw("p-4 bg-blue-50 flex flex-row justify-between")}
                >
                  <Text style={tw("text-base font-bold text-blue-800")}>
                    Total General
                  </Text>
                  <Text style={tw("text-base font-bold text-blue-800")}>
                    $3,810.00
                  </Text>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>

      {/* </div> */}
    </ModalComponent>
  );
};
// ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);

export default PdfRequisition;
