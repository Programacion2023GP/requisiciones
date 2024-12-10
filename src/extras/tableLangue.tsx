export const localeText = {
    "paginationPageSize": "Tamaño de página",
    "page": "Página",
    "more": "Más",
    "to": "a",
    "of": "de",
    "next": "Siguiente",
    "last": "Último",
    "first": "Primero",
    "previous": "Anterior",
    "loadingOoo": "Cargando...",
    "noRowsToShow": "No hay datos para mostrar",

    "selectAll": "Seleccionar todo",
    "searchOoo": "Buscar...",
    "blanks": "Vacíos",
    "filterOoo": "Filtrar...",
    "applyFilter": "Aplicar filtro",
    "clearFilter": "Limpiar filtro",
    "resetFilter": "Resetear",
    "cancelFilter": "Cancelar",

    "equals": "Igual a",
    "notEqual": "Distinto de",
    "empty": "Elija una",
    "lessThan": "Menor que",
    "greaterThan": "Mayor que",
    "lessThanOrEqual": "Menor o igual que",
    "greaterThanOrEqual": "Mayor o igual que",
    "inRange": "En el rango",
    "contains": "Contiene",
    "notContains": "No contiene",
    "startsWith": "Empieza con",
    "endsWith": "Termina con",
    "andCondition": "cumplir ambas condiciones",
    "orCondition": "Cualquiera de las dos",
    "group": "Grupo",
    "columns": "Columnas",
    "filters": "Filtros",
    "rowGroupColumnsEmptyMessage": "Arrastre columnas aquí para agrupar",
    "valueColumnsEmptyMessage": "Arrastre columnas aquí para agregar",
    "pivotMode": "Modo de pivote",
    "groups": "Grupos",
    "values": "Valores",
    "pivots": "Pivotes",
    "groupRows": "Agrupar filas",
    "loading": "Cargando...",
    "enabled": "Habilitado",
    "pinColumn": "Fijar columna",
    "valueAggregation": "Agregación de valores",
    "autosizeThiscolumn": "Ajustar tamaño de esta columna",
    "autosizeAllColumns": "Ajustar tamaño de todas las columnas",
    "groupBy": "Agrupar por",
    "unGroupBy": "Desagrupar por",
    "resetColumns": "Restablecer columnas",
    "expandAll": "Expandir todo",
    "collapseAll": "Colapsar todo",
    "toolPanel": "Panel de herramientas",
    "export": "Exportar",
    "csvExport": "Exportar a CSV",
    "excelExport": "Exportar a Excel",
    "pinLeft": "Fijar a la izquierda",
    "pinRight": "Fijar a la derecha",
    "noPin": "No fijar",
    "sum": "Suma",
    "min": "Mínimo",
    "max": "Máximo",
    "none": "Ninguno",
    "count": "Conteo",
    "average": "Promedio",
    "copy": "Copiar",
    "copyWithHeaders": "Copiar con encabezados",
    "ctrlC": "Ctrl+C",
    "paste": "Pegar",
    "ctrlV": "Ctrl+V",
    "pagePrevious": "Página anterior",
    "pageNext": "Página siguiente",
    "pivotColumnGroupTotals": "Totales del grupo de columnas de pivote",
    "sortAscending": "Orden Ascendente",
    "sortDescending": "Orden Descendente",
    "groupByColumn": "Agrupar por {{field}}",
    "ungroupByColumn": "Desagrupar por {{field}}",
    "expandAllColumnGroups": "Expandir todos los grupos de columnas",
    "collapseAllColumnGroups": "Colapsar todos los grupos de columnas"
  }
  export const gridOptions = {
    api: import.meta.env.VITE_API_URL, // URL de la API
    paginationPageSize: 10, // Tamaño de página inicial
    paginationPageSizeSelector: [10, 25, 50, 100], // Opciones para cambiar el tamaño de página
    defaultColDef: {
      resizable: true, // Permite ajustar manualmente el tamaño de las columnas
      filterParams: {
        buttons: ["apply", "reset"],
      },
      flex: 1, // Ajuste proporcional por defecto
    },
    onFirstDataRendered: (params: { api: { sizeColumnsToFit: () => void; }; }) => {
      params.api.sizeColumnsToFit(); // Ajustar al contenedor
      // Si prefieres ajustar al contenido:
      // params.api.autoSizeColumns(params.columnApi.getAllColumns().map(col => col.getColId()));
    },
  };
  