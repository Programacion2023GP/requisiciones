import React, { useState, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { localeText } from "../../extras/tableLangue";
import InputComponent from "../form/Input";
import { TypeTable } from "./Typetable";
import { ColComponent, RowComponent } from "../../responsive/Responsive";
import Button from "../form/Button";
import CollapseComponent from "../colapse/Colapse";
import { FiChevronDown } from "react-icons/fi"; // Asegúrate de instalar React Icons si no lo tienes
import ModalComponent from "../modal/Modal";
import HelpModal from "./Helpinfo";
import { ColDef, RowClassRules } from "ag-grid-community";
import Typography from "../typografy/Typografy";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { PermissionMenu } from "../../extras/menupermisos";

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
  backUrl,
  getRowClass,
  permissionsUserTable
  
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
  const [open, setOpen] = useState<boolean>(false);
  const [openColumns, setOpenColumns] = useState(false);
  const [columnDefsH, setColumnDefsH] = useState<ColDef<any>[]>(columnDefs);
  const [dataTable, setDataTable] = useState({
    previous: [],
    data: [],
    sql: "",
    key: "",
  });
  // const [expand,setExpa]
  const toggleColumnVisibility = (field: string | undefined) => {
    setColumnDefsH((prevState) =>
      prevState.map(
        (col) =>
          col.field === field
            ? { ...col, hide: !col.hide } // Cambia la visibilidad de la columna seleccionada
            : col // Deja el resto de columnas sin cambios
      )
    );
  };
  // const queries = useQueries({
  //   queries: [
  //     {
  //       queryKey: [`${backUrl?.pathName}`],
  //       queryFn: () => GetAxios(`${backUrl?.pathName}`),
  //       refetchOnWindowFocus: true,
  //     },

  //   ],
  // });
  // const [dataOfTable] = queries;
  const [filtersColapseOptions, setFiltersColapseOptions] =
    useState<FiltersColapseOptions>({
      titles: [],
    });
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
    onMutate(variables) {
      // Preparar la mutación
      setDataTable((prev) => ({
        data: [],
        key: "",
        sql: "",
        previous: [],
      }));
    },
    onSuccess: (data) => {
      setDataTable((prev) => ({
        previous: prev.previous,
        data: data?.data,
        sql: "",
        key: generateRandomKey(50),
      }));
      mutation.reset();
    },
    onError: (error: any) => {
      //  console.log("errror",error)
    },
  });
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10); // Genera un número entre 0 y 9
  };
  const generateRandomKey = (length: number) => {
    let key = "";
    for (let i = 0; i < length; i++) {
      key += generateRandomNumber(); // Concatenar números aleatorios
    }
    return key;
  };
  useMemo(() => {
    if (backUrl?.restart) {
      console.log("restaurando busqueda");
      mutation.mutate({
        url: backUrl?.pathName ? backUrl.pathName : "",
        method: "POST",
        data: { sql: backUrl?.startSearchFilter?.where },
      });
    }
  
  }, [backUrl?.restart]);
  useMemo(() => {
 
    if (backUrl?.pathName && !backUrl?.restart) {
      mutation.mutate({
        url: backUrl?.pathName ? backUrl.pathName : "",
        method: "POST",
        data: { sql: backUrl?.startSearchFilter?.where },
      });
    }
  }, []);
  useEffect(() => {
    if (data.length > 0) {
      setDataTable((prev) => ({
        ...prev,
        data: data,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (
      dataTable &&
      Array.isArray(dataTable.data) &&
      dataTable.data.length > 0
    ) {
      let filtered = [];
      if (search.row) {
        // Filtro por una columna específica
        filtered = dataTable.data.filter((item) =>
          String(item[search.row] || "") // Validación de seguridad
            .toLowerCase()
            .includes(search.text.toLowerCase())
        );
      } else {
        // Filtro general
        filtered = dataTable.data.filter((item: { [s: string]: unknown }) =>
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
        titles: Object.keys(dataTable.data[0]), // Extrae las claves del primer elemento
      }));
    }
  }, [search.text, search.row, dataTable.data]); // Agrega dependencias relevantes
  // useEffect(() =>{
  //   console.log("nueva",filteredData)
  // },[filteredData])
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
  const handleFilterChange = (params: {
    api: { getFilterModel: () => any };
  }) => {
    const filters = params.api.getFilterModel(); // Obtiene los filtros activos

    const sqlWhereClause = Object.entries(filters)
      .map(([field, filter]: [string, any]) => {
        const {
          filterType,
          type,
          filter: value,
          filterTo,
          operator,
          conditions,
        } = filter;

        if (conditions && Array.isArray(conditions)) {
          // Procesa condiciones múltiples (como AND o OR)
          const conditionExpressions = conditions.map((condition: any) => {
            const { type, filter, filterTo } = condition;
            if (filterType === "number") {
              if (type === "equals") return `${field} = ${filter}`;
              if (type === "notEqual") return `${field} != ${filter}`;
              if (type === "greaterThan") return `${field} > ${filter}`;
              if (type === "greaterThanOrEqual") return `${field} >= ${filter}`;
              if (type === "lessThan") return `${field} < ${filter}`;
              if (type === "lessThanOrEqual") return `${field} <= ${filter}`;
              if (type === "inRange")
                return `${field} BETWEEN ${filter} AND ${filterTo}`;
            }
            return ""; // Ignorar condiciones no válidas
          });

          // Une las condiciones usando el operador (AND/OR)
          return `(${conditionExpressions.join(` ${operator} `)})`;
        }

        // Procesa filtros simples
        switch (filterType) {
          case "text":
            if (type === "contains") return `${field} LIKE '%${value}%'`;
            if (type === "equals") return `${field} = '${value}'`;
            if (type === "notEqual") return `${field} != '${value}'`;
            if (type === "startsWith") return `${field} LIKE '${value}%'`;
            if (type === "endsWith") return `${field} LIKE '%${value}'`;
            break;

          case "number":
            if (type === "equals") return `${field} = ${value}`;
            if (type === "notEqual") return `${field} != ${value}`;
            if (type === "greaterThan") return `${field} > ${value}`;
            if (type === "greaterThanOrEqual") return `${field} >= ${value}`;
            if (type === "lessThan") return `${field} < ${value}`;
            if (type === "lessThanOrEqual") return `${field} <= ${value}`;
            if (type === "inRange")
              return `${field} BETWEEN ${value} AND ${filterTo}`;
            break;

          default:
            return ""; // Ignorar filtros desconocidos
        }
      })
      .filter(Boolean) // Elimina cualquier filtro no válido o vacío
      .join(" AND "); // Une las condiciones con

    if (data.length > 0) {
      return;
    }
    if (sqlWhereClause != "") {
      setDataTable((prev) => ({
        previous: prev.previous,
        data: [],
        sql: sqlWhereClause,
        key: generateRandomKey(50),
      }));
      mutation.mutate({
        url: backUrl?.pathName ? backUrl.pathName : "",
        method: "POST",
        data: { sql: sqlWhereClause },
      });
    } else {
      mutation.mutate({
        url: backUrl?.pathName ? backUrl.pathName : "",
        method: "POST",
        data: { sql: data.sql },
      });
      setDataTable((prev) => ({
        previous: prev.previous,
        data: [],
        sql: prev.sql,
        key: generateRandomKey(50),
      }));
    }
  };

  // Función para manejar valores de las celdas
  const handleCellValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return "";
    return String(value); // Convierte cualquier valor en string
  };
  const defaulColDef = useMemo(
    () => ({
      filterParams: {
        buttons: ["apply", "reset"],
      },
      resizable: true, // Asegura que las columnas puedan ajustarse

    }),
    []
  );

  return (
    <div>
      <div
        className="ag-theme-alpine"
        style={{ height: "fit-content", width: "100%" }}
      >
        <div
          style={{
            background: "#F8F8F8",
            borderRight: "2px solid #c1c1c1",
            borderTop: "2px solid #c1c1c1",
            borderLeft: "2px solid #c1c1c1",
          }}
        >
          <div className="mx-2 mt-1">
                    {permissionsUserTable?.buttonElement ?
                    <PermissionMenu IdMenu={permissionsUserTable?.buttonElement}>
                    {buttonElement}
                    </PermissionMenu>
                    :
                    {buttonElement}
                    
                    }

          </div>
        </div>
        <PermissionMenu IdMenu={permissionsUserTable?.table}>
        <RowComponent>
          <ColComponent
            autoPadding={false}
            responsive={{
              "2xl": openColumns || colapse ? 9 : 12,
              xl: openColumns || colapse ? 9 : 12,
              lg: openColumns || colapse ? 9 : 12,
              md: 12,
              sm: 12,
            }}
          >
            <div className="flex items-stretch">
              <div className="flex-1">
                <AgGridReact
                  // key={data.length>0?"key":dataTable?.key}
                  onFilterChanged={handleFilterChange} // Maneja el cambio de filtros
                  pagination={true}
                  paginationPageSize={10}
                  paginationPageSizeSelector={[10, 25, 50, 100]}
                  loading={
                    mutation.status === "pending"
                  }
                  rowData={filteredData}
                  columnDefs={columnDefsH}
                  localeText={localeText}
                  // 
                  getRowClass={getRowClass}
                  rowSelection="multiple"
                  domLayout="autoHeight"
                  className="shadow-lg rounded-lg border border-gray-200"
                  onPaginationChanged={handlePaginationChange}
                  defaultColDef={defaulColDef}
                />
              </div>

              <div className="max-md:hidden lg:flex-shrink-0">
                {!colapse && !openColumns && (
                  <>
                    <button
                      onClick={() => setOpenColumns(true)}
                      style={{
                        background: "#F8F8F8",
                        borderRight: "4px solid #c1c1c1",
                        borderTop: "2px solid #c1c1c1",
                        borderBottom: "4px solid #c1c1c1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textWrap: "wrap",
                      }}
                      className={`w-20 ${backUrl?.pathName ? "h-1/2" : "h-1/3"} text-black px-4 py-2 rounded hover:bg-blue-600`}
                    >
                      <span
                        style={{
                          textWrap: "wrap",
                          transform: "rotate(90deg)",
                          transformOrigin: "center",
                          whiteSpace: "nowrap",
                          display: "inline-block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        Columnas
                      </span>
                    </button>
                    {!backUrl?.pathName && (
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
                          textWrap: "wrap",
                        }}
                        className={` ${backUrl?.pathName ? "h-1/2" : "h-1/3"}  w-20  text-black px-4 py-2 rounded hover:bg-blue-600`}
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
                    <button
                      onClick={() => setOpen(true)}
                      style={{
                        background: "#F8F8F8",
                        borderRight: "4px solid #c1c1c1",
                        borderTop: "4px solid #c1c1c1",
                        borderBottom: "4px solid #c1c1c1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textWrap: "wrap",
                      }}
                      className={` ${backUrl?.pathName ? "h-1/2" : "h-1/3"}  w-20 text-black px-4 py-2 rounded hover:bg-blue-600`}
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
                        ¿Como usar la tabla? (Manual)
                      </span>
                    </button>
                  </>
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
              md: 0,
              sm: 0,
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

                        setSelectedFilter(value);
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
              {!backUrl?.pathName && (
                <RowComponent>
                  {filtersColapseOptions.titles.map((title, id) => {
                    const column = columnDefs.find(
                      (column) => column.field === title
                    );
                    if (
                      selectedFilter != "general" &&
                      column &&
                      column.field != selectedFilter
                    )
                      return null;
                    if (!column?.headerName) return null;
                    if (column?.type == "dateColumn") return null;

                    const groupedData = data.reduce(
                      (acc: { [key: string]: number }, item: any) => {
                        const cellValue = String(item[title] || "");
                        acc[cellValue] = (acc[cellValue] || 0) + 1;
                        return acc;
                      },
                      {}
                    );

                    const filteredEntries = Object.entries(groupedData).filter(
                      ([value]) =>
                        value
                          .toLowerCase()
                          .includes(
                            filtersColapseOptions[title]?.toLowerCase() || ""
                          )
                    );

                    return (
                      <ColComponent key={id}>
                        <CollapseComponent title={column.headerName}>
                          <div className="space-y-2">
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

                            {filteredEntries.map(([value, count]) => (
                              <div
                                key={value}
                                className="flex justify-between items-center p-2 border-b border-gray-300 hover:text-purple-500 hover:font-semibold text-gray-700 cursor-pointer"
                                onClick={() => {
                                  setSelectedFilter(
                                    column.field ? column.field : ""
                                  );
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
              )}

              <div className="w-fit absolute top-2 right-2 ">
                <Button
                  color="red"
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setColapse(false);
                  }}
                >
                  X
                </Button>
              </div>
            </div>
          </ColComponent>
          <ColComponent
            autoPadding={false}
            responsive={{
              "2xl": openColumns ? 3 : 0,
              xl: openColumns ? 3 : 0,
              lg: openColumns ? 3 : 0,
              md: 0,
              sm: 0,
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
              <div className="w-fit absolute top-2 right-2 ">
                <Button
                  color="red"
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setOpenColumns(false);
                    // setSearch(());
                  }}
                >
                  X
                </Button>
              </div>
              <Typography variant="h2" className="w-full text-center">
                {" "}
                Mostrar/Ocultar Columnas
              </Typography>
              {columnDefsH.map((col) => (
                <div key={col.field} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      col.hide == undefined ? true : col.hide ? false : true
                    }
                    // checked={columnDefs.includes(col.field)}
                    onChange={() => toggleColumnVisibility(col.field)}
                    className="w-5 mb-1 h-5 cursor-pointer text-blue-600 bg-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  />
                  <label
                    htmlFor={col.field}
                    className="text-sm text-gray-700 font-medium"
                  >
                    {col.headerName}
                  </label>
                </div>
              ))}
            </div>
          </ColComponent>
        </RowComponent>
        <ModalComponent
          open={open}
          setOpen={() => setOpen(false)}
          title="Cómo usar la tabla"
        >
          <HelpModal />
        </ModalComponent>
        </PermissionMenu>

    
      </div>
    </div>
  );
};
