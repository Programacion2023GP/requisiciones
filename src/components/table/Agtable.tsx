import { AgGridReact } from "ag-grid-react";
import { gridOptions, localeText } from "../../extras/tableLangue";
import { TypeTable } from "./Typetable";
import { useEffect, useMemo, useState } from "react";
import { ColComponent, RowComponent } from "../../responsive/Responsive";
import InputComponent from "../form/Input";

export const Agtable: React.FC<TypeTable> = ({ isLoading, columnDefs = [], data = [], buttonElement }) => {
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
    } else {
      // setFilteredData([]);
    }
  }, [searchText, data]);
  

  const handleChange = (search: string) => {
    setSearchText(search);
  };

  return (
    <div>
    
    <div className="flex items-center space-x-4">
  {buttonElement}
  <InputComponent label="Buscador" name="buscador" suscribeValue={handleChange} />
</div>

      <AgGridReact
        gridOptions={gridOptions}
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
      />
    </div>
  );
};
