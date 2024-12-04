import { AgGridReact } from "ag-grid-react";
import { localeText } from "../../extras/tableLangue";
import { useMemo, useState } from "react";
import InputComponent from "../form/Input";
import { TypeTable } from "./Typetable";

export const Agtable: React.FC<TypeTable> = ({
  isLoading,
  columnDefs = [],
  data = [],
  buttonElement,
  handlePropsChangePage
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useMemo(() => {
    if (data && data.length > 0) {
      const filtered = data.filter((item: { [s: string]: unknown }) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchText, data]);

  const handleChange = (search: string) => {
    setSearchText(search);
  };

  const handlePaginationChange = (params: any) => {
    // Obtener la instancia de la grid API desde `params.api`
    const currentPage = params.api.paginationGetCurrentPage() + 1; // La página base 0
    const pageSize = params.api.paginationGetPageSize(); // Tamaño de la página
    const totalPages = params.api.paginationGetTotalPages(); // Número total de páginas
    const totalRows = params.api.paginationGetRowCount(); // Total de filas
    if(handlePropsChangePage){
      handlePropsChangePage(currentPage,pageSize,totalPages,totalRows);

    }
    // console.log("Página actual:", currentPage);
    // console.log("Tamaño de página:", pageSize);
    // console.log("Número total de páginas:", totalPages);
    // console.log("Total de filas:", totalRows);
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        {buttonElement}
        <InputComponent label="Buscador" name="buscador" suscribeValue={handleChange} />
      </div>

      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
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
          onGridReady={(params) => {
            // Aquí puedes acceder a la API de AG Grid
            console.log("Grid API Ready:", params.api);
          }}
          onPaginationChanged={handlePaginationChange} // Usamos la función en el evento de paginación
        />
      </div>
    </div>
  );
};
