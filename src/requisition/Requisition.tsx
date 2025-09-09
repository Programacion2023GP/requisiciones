import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ColComponent, RowComponent } from "../responsive/Responsive";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  FormikAutocomplete,
  FormikInput,
  FormikNumberInput,
  FormikTextArea,
} from "../components/formik/FormikInputs/FormikInput";
import { showConfirmationAlert, showToast } from "../sweetalert/Sweetalert";
import PageTransition, {
  PageTransitionRef,
} from "../components/stepper/Stepper";
import Button from "../components/form/Button";
import { FormikProps } from "formik";
import { LuPlus } from "react-icons/lu";
import Tooltip from "../components/toltip/Toltip";
import { CgCloseO } from "react-icons/cg";
import { Agtable } from "../components/table/Agtable";
import { ColDef } from "ag-grid-community";
import Typography from "../components/typografy/Typografy";
import Actions from "./actions/Actions";
import Chip from "../components/chip/Chip";
import Observable from "../extras/observable";
import { PermissionMenu } from "../extras/menupermisos";
import Spinner from "../loading/Loading";
import YearSelect from "./select/Dropdown";
import StatusColumn from "./columns/status/Status";
import RequisitionForm from "./form/Requisition";

type ChipsProps = {
  captura: boolean;
  autorizada: boolean;
  asignado: boolean;
  cotizado: boolean;
  realizada: boolean;
  rechazada: boolean;
  ordenDeCompra: boolean;
  surtida: boolean;
};
const RequisicionesAdd = () => {
  const pageTransitionRef = useRef<PageTransitionRef>(null);
  const [spiner, setSpiner] = useState<boolean>(false);
  const [filters, setFilters] = useState<string>(
    `Ejercicio = '${new Date().getFullYear()}'`
  );
  const [chipsOpen, setChipsOpen] = useState<ChipsProps>({
    rechazada: false,
    captura: false,
    autorizada: false,
    asignado: false,
    cotizado: false,
    ordenDeCompra: false,
    surtida: false,
    realizada: false,
  });
  const formik = useRef<FormikProps<Record<string, any>> | null>(null);
  const queryClient = useQueryClient();
  const { ObservablePost, ObservableDelete } = Observable();
  const [open, setOpen] = useState<boolean>(false);

  const [reloadTable, setReloadTable] = useState(false);

  const [columnDefs] = useState<ColDef<any>[]>([
    {
      headerName: "Folio",
      field: "IDRequisicion",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Ejercicio",
      field: "Ejercicio",
      sortable: true,
      filter: true,
      filterParams: {
        defaultValue: "2025",
      },
    },
    {
      headerName: "Departamento",
      field: "Nombre_Departamento",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Solicitante",
      field: "Solicitante",
      sortable: true,
      filter: true,
    },

    {
      headerName: "FechaCaptura",
      field: "FechaCaptura",
      filter: "agDateColumnFilter",
      resizable: true,
      cellRenderer: (data: { value: string | number | Date }) => {
        // Asegúrate de que la fecha se muestre en un formato adecuado
        return data.value ? new Date(data.value).toLocaleDateString() : "";
      },
      filterParams: {
        comparator: (dateFromFilter, cellValue) => {
          if (cellValue == null) {
            return 0;
          }

          // Convertir cellValue a un objeto Date
          const cellDate = new Date(cellValue);

          // Si la conversión a Date es incorrecta, retorna 0 (filtro no encontrado)
          if (isNaN(cellDate.getTime())) {
            return 0;
          }

          // Eliminar las horas, minutos, segundos y milisegundos de ambas fechas
          const cellDateOnly = new Date(cellDate);
          const filterDateOnly = new Date(dateFromFilter);

          // Establecer la hora a las 00:00:00 para ambas fechas
          cellDateOnly.setHours(0, 0, 0, 0);
          filterDateOnly.setHours(0, 0, 0, 0);

          // Comparar solo las fechas (sin considerar horas, minutos o segundos)
          if (cellDateOnly < filterDateOnly) {
            return -1;
          } else if (cellDateOnly > filterDateOnly) {
            return 1;
          }

          return 0; // Si son iguales
        },
      },
    },

    {
      headerName: "Status",
      field: "Status",
      sortable: true,
      // filter: true,
      valueFormatter: (params: any) => {
        const value = params.value;
        const map: Record<string, string> = {
          ca: "Captura",
          va: "Validado",
          re: "Rechazado",
          su: "Surtida",

          // otros valores si aplican
        };
        return map[value] || value; // Retorna el valor legible
      },
      cellRenderer: (params: any) => <StatusColumn data={params.data} />,
    },
    {
      headerName: "Tipo",
      field: "TipoNombre",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Observaciones",
      field: "Observaciones",
      sortable: true,
      filter: true,
    },
    {
      headerName: "asignado",
      field: "UsuarioAS",
      sortable: true,
      filter: true,
    },
    {
      headerName: "VoBo",
      field: "UsuarioVoBo",
      sortable: true,
      filter: true,
    },

    {
      headerName: "captura",
      field: "UsuarioCaptura",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Acciones",
      colId: "buttons",
      // field: "Rol", // Usamos colId para identificar la columna sin usar field
      // sortable: true,
      // filter: true,
      cellRenderer: (params: any) => (
        <Actions
          data={params.data}
          setReloadTable={setReloadTable}
          setOpenForm={setOpen}
        />
      ), // Usamos cellRendererFramework
    },
  ]);
  const buttonElement = useMemo(
    () => (
      <Tooltip content="Agregar Requisición">
        <div className="mb-4">
          <Button
            onClick={() => {
              setOpen(true);
              ObservableDelete("FormRequisicion");
            }}
            size="medium"
            color="blue"
            variant="solid"
          >
            <LuPlus />
          </Button>
        </div>
      </Tooltip>
    ),
    []
  );

  // const year =2024
  const chipData = [
    {
      message: "Rechazada (CA)",
      className: "bg-red-500",
      key: "rechazada",
      sql: "ca",
    },
    {
      message: "Captura (CP)",
      className: "bg-gray-400",
      key: "captura",
      sql: "cp",
    },
    {
      message: "Autorizada (AU)",
      className: "bg-black",
      key: "autorizada",
      sql: "au",
    },
    {
      message: "Asignado (AS)",
      className: "bg-purple-500",
      key: "asignado",
      sql: "as",
    },
    {
      message: "Cotizado (CO)",
      className: "bg-orange-500",
      key: "cotizado",
      sql: "co",
    },
    {
      message: "Orden de Compra (OC)",
      className: "bg-pink-500",
      key: "ordenDeCompra",
      sql: "oc",
    },
    {
      message: "Surtida (SU)",
      className: "bg-lime-500",
      key: "surtida",
      sql: "su",
    },
    {
      message: "Todos los status",
      className: "bg-neutral-500",
      key: "",
      sql: "",
    },

    // { message: "Realizada (RE)", className: "bg-cyan-500", key: "realizada" },
  ];

  return (
    <>
      {spiner && <Spinner />}

      <PermissionMenu
        IdMenu={["Listado", "SeguimientoRequis", "RequisicionesAdd"]}
      >
        <div className="container mx-auto shadow-lg p-6 border mt-12 relative">
          <Typography
            className="w-full text-center py-2"
            variant="h2"
            color="black"
            size="3xl"
          >
            la tabla empieza consultando el ejercicio del año actual
            {" " + new Date().getFullYear()}
          </Typography>
          <div className="flex w-full flex-row flex-wrap justify-center mb-6  ">
            {chipData.map(({ message, className, key, sql }) => (
              <Chip
                key={key}
                message={message}
                className={className}
                open={
                  key === ""
                    ? Object.values(chipsOpen).every((v) => !v)
                    : chipsOpen[key]
                } // Check if this specific chip is open
                setOpen={() => {
                  setReloadTable(false);

                  if (key === "") {
                    // Handle "Todos los status" case - close all chips
                    setChipsOpen({
                      rechazada: false,
                      captura: false,
                      autorizada: false,
                      asignado: false,
                      cotizado: false,
                      ordenDeCompra: false,
                      surtida: false,
                      realizada: false,
                    });
                  } else {
                    // Toggle the specific chip and close all others
                    setChipsOpen((prev) => ({
                      rechazada: false,
                      captura: false,
                      autorizada: false,
                      asignado: false,
                      cotizado: false,
                      ordenDeCompra: false,
                      surtida: false,
                      realizada: false,
                      [key]: !prev[key], // Toggle only this chip
                    }));
                  }
                }}
                children={() => (
                  <YearSelect
                    onChange={(value) => {
                      console.log(sql);
                      if (sql == "" && (value == null || value == undefined)) {
                        showToast(
                          "Demasiada información por favor pon almenos un filtro",
                          "info"
                        );
                        return;
                      }
                      const whereSql = `${sql ? `status = '${sql}'` : ""} ${value == null || value == undefined ? "" : sql != "" ? " and " + value : value}`;

                      setFilters(whereSql);
                      setReloadTable(true);
                      // setFilters(value)
                    }}
                    setClosed={() => {
                      setChipsOpen({
                        rechazada: false,
                        captura: false,
                        autorizada: false,
                        asignado: false,
                        cotizado: false,
                        ordenDeCompra: false,
                        surtida: false,
                        realizada: false,
                      });
                    }}
                  />
                )}
              />
            ))}
          </div>
          <Agtable
            permissionsUserTable={{
              table: "Listado",
              buttonElement: "RequisicionesAdd",
            }}
            // getRowClass={getRowClass}
            backUrl={{
              pathName: "requisiciones/index",
              startSearchFilter: {
                where: filters,
                // where: `Ejercicio = '2024'`,
              },
              restart: reloadTable,
            }}
            filtersActive={{
              Ejercicio: "2025",
            }}
            columnDefs={columnDefs}
            buttonElement={buttonElement}
            colapseFilters
          />
        </div>
        {open && (
          <RequisitionForm
            open={open}
            setOpen={() => {
              setOpen(false);
            }}
            setReloadTable={setReloadTable}
            title="Requisicion"
          ></RequisitionForm>
        )}
      </PermissionMenu>
    </>
  );
};
export default RequisicionesAdd;
