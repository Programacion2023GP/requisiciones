import React, { useState, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { localeText } from "../../extras/tableLangue";
import InputComponent from "../form/Input";
import { TypeTable } from "./Typetable";
import { ColComponent, RowComponent } from "../../responsive/Responsive";
import Button from "../form/Button";
import CollapseComponent from "../colapse/Colapse";
import { FiChevronDown } from "react-icons/fi"; // Asegúrate de instalar React Icons si no lo tienes

type FiltersColapseOptions = {
  titles: string[];
};
type SearchType = {
  text: string;
  includes: boolean;
  row: string | null;
  headerName: string;
};
export const Agtable: React.FC<TypeTable> = ({
  isLoading,
  columnDefs = [],
  data = [],
  buttonElement,
  handlePropsChangePage,
  colapseFilters,
}) => {
  const [search, setSearch] = useState<SearchType>({
    text: "",
    includes: true,
    row: null,
    headerName: "",
  });
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [colapse, setColapse] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | "general">(
    "general"
  );
  // const [expand,setExpa]
  const [filtersColapseOptions, setFiltersColapseOptions] =
    useState<FiltersColapseOptions>({
      titles: [],
    });
  const [gridDimensions, setGridDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    if (data && data.length > 0) {
      console.log(search.text);

      let filtered = [];

      if (search.row) {
        // Filtro por una columna específica
        filtered = data.filter((item) =>
          String(item[search.row] || "") // Validación de seguridad
            .toLowerCase()
            .includes(search.text.toLowerCase())
        );
      } else {
        // Filtro general
        filtered = data.filter((item: { [s: string]: unknown }) =>
          Object.values(item).some((value) =>
            String(value || "") // Validación de valores nulos o indefinidos
              .toLowerCase()
              .includes(search.text.toLowerCase())
          )
        );
      }

      setFilteredData(filtered);

      // Actualización de opciones de colapso de filtros
      setFiltersColapseOptions((prev) => ({
        ...prev,
        titles: Object.keys(data[0]), // Extrae las claves del primer elemento
      }));
    }
  }, [search.text, search.row, data]); // Agrega dependencias relevantes

  const handleChange = (search: string) => {
    setSearch((prev) => ({
      ...prev,
      text: search,
    }));
  };

  const handlePaginationChange = (params: any) => {
    const currentPage = params.api.paginationGetCurrentPage() + 1;
    const pageSize = params.api.paginationGetPageSize();
    const totalPages = params.api.paginationGetTotalPages();
    const totalRows = params.api.paginationGetRowCount();
    if (handlePropsChangePage) {
      handlePropsChangePage(currentPage, pageSize, totalPages, totalRows);
    }
  };

  // Función para manejar valores de las celdas
  const handleCellValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return "";
    return String(value); // Convierte cualquier valor en string
  };

  return (
    <div>
      <div
        className="ag-theme-alpine"
        style={{ height: "fit-content", width: "100%" }}
      >
        <RowComponent>
          <ColComponent
            autoPadding={false}
            responsive={{
              "2xl": colapse ? 9 : 12,
              xl: colapse ? 9 : 12,
              lg: colapse ? 9 : 12,
              md: colapse ? 6 : 12,
              sm: colapse ? 6 : 12,
            }}
          >
            <div className="flex items-stretch">
              <div className="flex-1">
                <AgGridReact
                  pagination={true}
                  paginationPageSize={10}
                  paginationPageSizeSelector={[10, 25, 50, 100]}
                  loading={isLoading}
                  rowData={filteredData || []}
                  columnDefs={columnDefs}
                  localeText={localeText}
                  rowSelection="multiple"
                  domLayout="autoHeight"
                  className="shadow-lg rounded-lg border border-gray-200"
                  onPaginationChanged={handlePaginationChange}
                />
              </div>

              <div className="flex-shrink-0">
                {!colapse && (
                  <button
                    onClick={() => setColapse(true)}
                    style={{
                      background: "#F8F8F8",
                      borderRight: "4px solid #c1c1c1",
                      borderTop: "4px solid #c1c1c1",
                      borderBottom: "4px solid #c1c1c1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    className="w-20 h-full text-black px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <span
                      style={{
                        transform: "rotate(90deg)",
                        transformOrigin: "center",
                        whiteSpace: "nowrap",
                        display: "inline-block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      Buscador y filtros
                    </span>
                  </button>
                )}
              </div>
            </div>
          </ColComponent>
          <ColComponent
            autoPadding={false}
            responsive={{
              "2xl": colapse ? 3 : 0,
              xl: colapse ? 3 : 0,
              lg: colapse ? 3 : 0,
              md: colapse ? 6 : 0,
              sm: colapse ? 6 : 0,
            }}
          >
            <div
              className="w-full text-black px-4 py-2 rounded relative overflow-auto h-[538px]"
              style={{
                background: "#F8F8F8",
                borderRight: "4px solid #c1c1c1",
                borderTop: "4px solid #c1c1c1",
                borderBottom: "4px solid #c1c1c1",
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
              }}
            >
              <div className="mt-12"></div>
              <div className="flex items-center space-x-4">
                <RowComponent>
                  <ColComponent>
                  <InputComponent
                  label={` ${search.row ? "Buscando por " + search.headerName : "Buscador General"}`}
                  name="buscador"
                  value={search.text}
                  suscribeValue={handleChange}
                />
                  </ColComponent>
                  <ColComponent>
                  <select
                  value={selectedFilter}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log(value,columnDefs.find((column) => column.field === value)
                    ?.headerName);
                    setSelectedFilter(
                      value
                    );
                    setSearch((prev) => ({
                      ...prev,
                      headerName:
                        columnDefs.find((column) => column.field === value)
                          ?.headerName || "",
                      row: value === "general" ? null : value,
                      text: prev.text,
                    }));
                  }}
                  className="block w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md transition ease-in-out duration-200"
                >
                  <option value="general">General</option>
                  {columnDefs.map((item, index) => (
                    <option key={index} value={item.field}>
                      {item.headerName}
                    </option>
                  ))}
                </select>
                <div className="mt-2"></div>

                  </ColComponent>
                </RowComponent>
               
             
              </div>
              <RowComponent>
                {filtersColapseOptions.titles.map((title) => {
                  // Buscar la columna correspondiente
                  const column = columnDefs.find(
                    (column) => column.field === title
                  );
                  if (
                    selectedFilter != "general" &&
                   column  && column.field!=selectedFilter
                  )
                    return null;
                  // Validar si existe la columna y su headerName
                  if (!column?.headerName) return null;

                  // Generar los valores agrupados por título
                  const groupedData = data.reduce(
                    (acc: { [key: string]: number }, item: any) => {
                      const cellValue = String(item[title] || "");
                      acc[cellValue] = (acc[cellValue] || 0) + 1;
                      return acc;
                    },
                    {}
                  );

                  // Filtrar valores según el texto de búsqueda
                  const filteredEntries = Object.entries(groupedData).filter(
                    ([value]) =>
                      value
                        .toLowerCase()
                        .includes(
                          filtersColapseOptions[title]?.toLowerCase() || ""
                        )
                  );

                  return (
                    <ColComponent key={title}>
                      <CollapseComponent title={column.headerName}>
                        <div className="space-y-2">
                          {/* Buscador para cada título */}
                          <InputComponent
                            label={`Buscar por ${column.headerName}`}
                            name={`search-${title}`}
                            suscribeValue={(searchText: string) => {
                              setFiltersColapseOptions((prev) => ({
                                ...prev,
                                [title]: searchText,
                              }));
                            }}
                          />

                          {/* Renderizar valores filtrados */}
                          {filteredEntries.map(([value, count]) => (
                            <div
                              key={value}
                              className="flex justify-between items-center p-2 border-b border-gray-300 hover:text-purple-500 hover:font-semibold text-gray-700 cursor-pointer"
                              onClick={() => {
                                setSelectedFilter(column.field?column.field :"")
                                setSearch({
                                  text: value,
                                  row: title,
                                  includes: false,
                                  headerName: column.headerName
                                    ? column.headerName
                                    : "",
                                });
                              }}
                            >
                              <div>{handleCellValue(value)}</div>
                              <div className="bg-purple-300 px-2 py-1 text-xs text-gray-500 rounded-full">
                                {count as number}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapseComponent>
                    </ColComponent>
                  );
                })}
              </RowComponent>

              <div className="w-fit absolute top-2 right-2 ">
                <Button
                  color="red"
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setColapse(false);
                    // setSearch(());
                  }}
                >
                  X
                </Button>
              </div>
            </div>
          </ColComponent>
        </RowComponent>
      </div>
    </div>
  );
};
