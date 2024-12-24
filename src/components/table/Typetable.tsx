import { ColDef } from "ag-grid-community";

export type TypeTable = {
    /** 
     * Indica si los datos están siendo cargados. 
     * Utilizado para mostrar un estado de carga mientras se obtienen los datos.
     */
    isLoading?: boolean;
    filtersActive?:Record<string,any>,
    /** 
     

     * Definición de las columnas de la tabla. 
     * Acepta un array de objetos que definen las columnas, como el nombre, el campo y otras configuraciones.
     */
    columnDefs: ColDef<any>[];
    getRowClass?: (params: any) => string | undefined;
    /** 
     * Los datos que se mostrarán en la tabla.
     * Debe ser un array de objetos donde cada objeto representa una fila de datos.
     */
    data?: any;
  
    /** 
     * Un elemento JSX que puede ser un botón o cualquier otro componente que se mostrará junto a la tabla.
     */
    buttonElement: React.ReactNode;
    handlePropsChangePage?:(currentPage:number,pageSize:number,totalPages:number,totalRows:number)=>void; 
    /** 
     * Se colapsaran buscadores con clicks para busquedas con filtradores
     */
    colapseFilters?: boolean;
    backUrl?:{
      pathName: string;
      startSearchFilter?:{
       where:string,
      }
      restart:boolean;
    }
    permissionsUserTable:{
      buttonElement:string,
      table:string;
    }
  };
  
  // Definimos una versión más específica del tipo donde url es obligatoria si paginateWithBackend es true.
 