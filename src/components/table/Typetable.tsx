export type TypeTable = {
    /** 
     * Indica si los datos están siendo cargados. 
     * Utilizado para mostrar un estado de carga mientras se obtienen los datos.
     */
    isLoading: boolean;
  
    /** 
     * Definición de las columnas de la tabla. 
     * Acepta un array de objetos que definen las columnas, como el nombre, el campo y otras configuraciones.
     */
    columnDefs: any;
  
    /** 
     * Los datos que se mostrarán en la tabla.
     * Debe ser un array de objetos donde cada objeto representa una fila de datos.
     */
    data: any;
  
    /** 
     * Un elemento JSX que puede ser un botón o cualquier otro componente que se mostrará junto a la tabla.
     */
    buttonElement: React.ReactNode;
    handlePropsChangePage?:(currentPage:number,pageSize:number,totalPages:number,totalRows:number)=>void; 
    /** 


     * Determina si la paginación debe gestionarse desde el backend.
     * Si es `true`, la paginación se manejará mediante consultas al servidor (por ejemplo, usando API paginadas).
     * Si es `false` o no se define, se manejará en el cliente.
     */
  
    /** 
     * La URL a la que se realizarán las consultas de paginación si `paginateWithBackend` es `true`.
     * Esta propiedad es obligatoria si `paginateWithBackend` es `true`, de lo contrario es opcional.
     */
  };
  
  // Definimos una versión más específica del tipo donde url es obligatoria si paginateWithBackend es true.
 