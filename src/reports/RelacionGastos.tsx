import { ColDef } from "ag-grid-community";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosRequest, GetAxios } from "../axios/Axios";
import { Agtable } from "../components/table/Agtable";
import Button from "../components/form/Button";
import { showToast } from "../sweetalert/Sweetalert";
import Pdfrequisition from "../requisition/pdf/Pdfrequisition";
import Observable from "../extras/observable";
import { BsFiletypePdf } from "react-icons/bs";

const money = (v: any) =>
  Number(v || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

const RelacionGastos = () => {
  const anioActual = new Date().getFullYear();
  const [IDDepartamento, setIDDepartamento] = useState<string>("");
  const [Ejercicio, setEjercicio] = useState<string>(String(anioActual));
  const [rows, setRows] = useState<any[]>([]);
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string>("");
  const { ObservablePost } = Observable();

  const pdf = useMutation({
    mutationFn: (row: any) =>
      AxiosRequest("reportes/requisicionpdf", "POST", {
        Id: row.Id,
        IDRequisicion: row.IDRequisicion,
        Ejercicio: row.Ejercicio,
      }),
    onSuccess: async (res) => {
      await ObservablePost("PdfRequisicion", {
        data: {
          products: res?.data?.products ?? [],
          pdfData: res?.data?.pdfData ?? {},
          status: res?.data?.pdfData?.Status,
        },
      });
      setPdfStatus(res?.data?.pdfData?.Status ?? "");
      setOpenPdf(true);
    },
    onError: () => showToast("No se pudo generar el PDF", "error"),
  });

  const departamentos = useQuery({
    queryKey: ["departamentos/index"],
    queryFn: () => GetAxios("departamentos/index"),
  });

  const anios = useMemo(
    () => Array.from({ length: anioActual - 2023 + 1 }, (_, i) => anioActual - i),
    [anioActual]
  );

  const buscar = useMutation({
    mutationFn: () =>
      AxiosRequest("reportes/relaciongastos", "POST", { IDDepartamento, Ejercicio }),
    onSuccess: (res) => setRows(res?.data ?? []),
    onError: () => showToast("Error al obtener el reporte", "error"),
  });

  const total = rows.reduce((acc, r) => acc + Number(r.Importe || 0), 0);

  const columnDefs: ColDef[] = [
    {
      headerName: "PDF",
      width: 80,
      cellRenderer: (p: any) => (
        <button
          title="Ver PDF de la requisición"
          className="text-red-600 text-xl mt-2"
          disabled={pdf.isPending}
          onClick={() => pdf.mutate(p.data)}
        >
          <BsFiletypePdf />
        </button>
      ),
    },
    { headerName: "No. Requisición", field: "IDRequisicion", width: 140 },
    { headerName: "Ejercicio", field: "Ejercicio", width: 110 },
    { headerName: "Departamento", field: "Nombre_Departamento", flex: 1 },
    { headerName: "Concepto", field: "Concepto", flex: 1 },
    {
      headerName: "Descripción del bien o servicio",
      field: "Descripcion",
      flex: 2,
      wrapText: true,
      autoHeight: true,
      valueFormatter: (p) => String(p.value ?? "").split(" | ").join("\n"),
      cellStyle: { whiteSpace: "pre-line", lineHeight: "1.4" },
    },
    {
      headerName: "Importe total",
      field: "Importe",
      width: 150,
      valueFormatter: (p) => money(p.value),
    },
  ];

  const selectCls = "border rounded-lg px-3 py-2 text-sm w-full";

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Relación de gastos</h2>
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="min-w-[280px]">
          <label className="text-sm block mb-1">Departamento</label>
          <select className={selectCls} value={IDDepartamento}
            onChange={(e) => setIDDepartamento(e.target.value)}>
            <option value="">Todos</option>
            {(departamentos.data?.data ?? []).map((d: any) => (
              <option key={d.IDDepartamento} value={d.IDDepartamento}>
                {d.Nombre_Departamento}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[140px]">
          <label className="text-sm block mb-1">Año</label>
          <select className={selectCls} value={Ejercicio}
            onChange={(e) => setEjercicio(e.target.value)}>
            <option value="">Todos</option>
            {anios.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <Button color="presidencia" variant="solid" size="medium"
          onClick={() => buscar.mutate()}>
          {buscar.isPending ? "Buscando..." : "Buscar"}
        </Button>
        <div className="ml-auto text-lg font-bold">Total: {money(total)}</div>
      </div>
      <Agtable
        permissionsUserTable={{ buttonElement: "RptRelacionGastos", table: "RptRelacionGastos" }}
        isLoading={buscar.isPending}
        data={rows}
        columnDefs={columnDefs}
        buttonElement={<></>}
        titleExport="Relacion de gastos"
      />
      {openPdf && (
        <Pdfrequisition
          open={openPdf}
          setOpen={() => setOpenPdf(false)}
          watermarkText={pdfStatus === "CA" ? "RECHAZADA" : ""}
        />
      )}
    </div>
  );
};

export default RelacionGastos;
