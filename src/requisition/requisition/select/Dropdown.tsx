import { useState } from "react";
import Button from "../../components/form/Button";
import { IoMdClose } from "react-icons/io";
import { useQueries } from "@tanstack/react-query";
import { GetAxios } from "../../axios/Axios";
import FormikForm from "../../components/formik/Formik";
import {
  FormikAutocomplete,
  FormikInput,
  FormikNumberInput,
} from "../../components/formik/FormikInputs/FormikInput";
import { RowComponent } from "../../responsive/Responsive";

type YearSelectProps = {
  onChange?: (value: string| null) => void; // Callback para manejar el cambio
  setClosed?: () => void; //
};

const YearSelect: React.FC<YearSelectProps> = ({ onChange, setClosed }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
  };
  const generateYearOptions = (startYear: number) => {
    const currentYear = new Date().getFullYear();
    const years = [{ key: "", value: "Todos los años" }];
    for (let i = startYear; i <= currentYear; i++) {
      years.push({ key: i.toString(), value: i.toString() });
    }
    return years;
  };
  const queries = useQueries({
    queries: [
      {
        queryKey: ["catDepartaments/index"],
        queryFn: () => GetAxios("departaments/index"),
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["tipos/index"],
        queryFn: () => GetAxios("tipos/index"),
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["autorizadoresRequisition/cotizadores"],
        queryFn: () => GetAxios(`autorizadores/cotizadores`),
        refetchOnWindowFocus: true,
      },
            {
        queryKey: ["departaments/director"],
        queryFn: () => GetAxios(`departaments/director/${localStorage.getItem('group')}`),
        refetchOnWindowFocus: true,
      },
      //   {
      //     queryKey: ["users/index"],
      //     queryFn: () => GetAxios("users/index"),
      //     refetchOnWindowFocus: true,
      //   },
      // Puedes agregar más peticiones aquí
    ],
  });
  const [groups, types, autorizadores] = queries;
  const onSubmit = (values: Record<string, any>) => {
    let sql: string | null = null;

    // Verificamos si ya se añadió una condición específica
    const conditionsSet = new Set<string>();
    
    Object.keys(values).forEach((it: any) => {
      if (values[it] != 0 && values[it] !== "") {
        if (it === "Solicitante") {
          const condition = `${it} LIKE '%${values[it]}%'`;
          if (!conditionsSet.has(condition)) {
            sql == null
              ? (sql = condition)
              : (sql += ` AND ${condition}`);
            conditionsSet.add(condition);
          }
        } else if (it === "FechaInicio" || it === "FechaFin") {
          if (it === "FechaInicio" && !values["FechaFin"]) {
            const condition = `FechaCaptura = '${values[it]}'`;
            if (!conditionsSet.has(condition)) {
              sql == null
                ? (sql = condition)
                : (sql += ` AND ${condition}`);
              conditionsSet.add(condition);
            }
          } else if (it === "FechaFin" && !values["FechaInicio"]) {
            const condition = `FechaCaptura = '${values[it]}'`;
            if (!conditionsSet.has(condition)) {
              sql == null
                ? (sql = condition)
                : (sql += ` AND ${condition}`);
              conditionsSet.add(condition);
            }
          } else if (values["FechaInicio"] && values["FechaFin"]) {
            const condition = `FechaCaptura BETWEEN '${values["FechaInicio"]}' AND '${values["FechaFin"]}'`;
            if (!conditionsSet.has(condition)) {
              sql == null
                ? (sql = condition)
                : (sql += ` AND ${condition}`);
              conditionsSet.add(condition);
            }
          }
        } else {
          const condition = `${it} = '${values[it]}'`;
          if (!conditionsSet.has(condition)) {
            sql == null
              ? (sql = condition)
              : (sql += ` AND ${condition}`);
            conditionsSet.add(condition);
          }
        }
      }
    });
    
    onChange &&  onChange(sql);
    if (setClosed) {
      setClosed();
    }
  };
  return (
    <div className="flex flex-col  md:w-96 p-2   gap-2  relative rounded-xl border-2 border-gray-400 ">
      <div className="w-fit absolute top-1 right-1  bg-gray-200">
        <IoMdClose
          className="w-6 h-6 absolute top-0 right-0 text-red-500 cursor-pointer"
          onClick={() => {
            if (setClosed) {
              setClosed();
            }
          }}
        />
      </div>

      {/* <select
        value={selectedValue}
        onChange={handleChange}
        className="w-full border-b cursor-pointer border-gray-300 focus:outline-none focus:border-blue-500 text-sm p-2 mt-2"
      >
        {options.map((option) => (
          <option className="cursor-pointer" key={option} value={option}>
            {option}
          </option>
        ))}
      </select> */}

      <FormikForm
      buttonMessage="Buscar"
        onSubmit={onSubmit}
        initialValues={{
          IDRequisicion: 0,
          Ejercicio: "",
          IDDepartamento: 0,
          FechaInicio: "",
          FechaFin: "",
          IDTipo: 0,
          Solicitante: "",
          // UsuarioAS: 0,
        }}
        children={() => (
          <div className="w-full mt-10">
            <FormikNumberInput
              name="IDRequisicion"
              label="Folio"
              padding={false}
              decimals={false}
            />
            <FormikInput
              
              name="Solicitante"
              label="Solicitante"
              padding={false}
            />
            {/* <FormikAutocomplete
              loading={autorizadores.isLoading}
              name="UsuarioAS"
              label="Autorizadores"
              options={autorizadores.data?.data}
              idKey={"IDUsuario"}
              labelKey={"NombreCompleto"}
            /> */}

            <FormikAutocomplete
              // padding={false}
              loading={groups.isLoading}
              name="IDDepartamento"
              label={"Departamento"}
              options={groups.data?.data}
              idKey={"IDDepartamento"}
              labelKey={"Nombre_Departamento"}
            />
            <FormikAutocomplete
              // padding={false}
              loading={types.isLoading}
              name="IDTipo"
              label={"Tipo"}
              options={types.data?.data}
              idKey={"IDTipo"}
              labelKey={"Descripcion"}
            />
            <FormikAutocomplete
              // padding={false}
              loading={groups.isLoading}
              name="Ejercicio"
              label={"Ejercicio"}
              options={generateYearOptions(2018)}
              idKey={"key"}
              labelKey={"value"}
            />

            <FormikInput
              responsive={{ lg: 6, xl: 6, "2xl": 6 }}
              name="FechaInicio"
              label="fecha inicial"
              type="date"
              padding={false}
            />
            <FormikInput
              responsive={{ lg: 6, xl: 6, "2xl": 6 }}
              name="FechaFin"
              label="fecha final"
              type="date"
              padding={false}
            />
           
          </div>
        )}
      />
    </div>
  );
};
export default YearSelect;
