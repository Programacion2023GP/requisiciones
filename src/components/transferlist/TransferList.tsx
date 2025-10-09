import React, { useState } from "react";
import { icons } from "../../constants";
import Tooltip from "../toltip/Toltip";

interface Departamento {
   Centro_Costo: number;
   FUM: string;
   FechaAlta: null;
   Firma_Director: string;
   IDDepartamento: number;
   Nombre_CC: string;
   Nombre_Departamento: string;
   Nombre_Director: string;
   Usuario: string;
   UsuarioFUM: string;
}

interface TransferListProps {
   departamentos: Departamento[];
   seleccionados?: number[];
   onChange?: (seleccionados: number[]) => void;
}

const TransferList: React.FC<TransferListProps> = ({
   departamentos,
   seleccionados = [],
   onChange,
}) => {
   const [selected, setSelected] = useState<number[]>(seleccionados);
   const [leftChecked, setLeftChecked] = useState<number[]>([]);
   const [rightChecked, setRightChecked] = useState<number[]>([]);
   const [searchLeft, setSearchLeft] = useState("");
   const [searchRight, setSearchRight] = useState("");

   const disponibles = departamentos.filter(
      (d) =>
         !selected.includes(d.IDDepartamento) &&
         d.Nombre_CC.toLowerCase().includes(searchLeft.toLowerCase()),
   );
   const elegidos = departamentos.filter(
      (d) =>
         selected.includes(d.IDDepartamento) &&
         d.Nombre_CC.toLowerCase().includes(searchRight.toLowerCase()),
   );

   // Helpers
   const updateSelected = (newSelected: number[]) => {
      setSelected(newSelected);
      onChange?.(newSelected);
   };

   const moveRight = () => {
      updateSelected([...selected, ...leftChecked]);
      setLeftChecked([]);
   };

   const moveAllRight = () => {
      updateSelected([
         ...selected,
         ...disponibles.map((d) => d.IDDepartamento),
      ]);
      setLeftChecked([]);
   };

   const moveLeft = () => {
      updateSelected(selected.filter((id) => !rightChecked.includes(id)));
      setRightChecked([]);
   };

   const moveAllLeft = () => {
      updateSelected(
         selected.filter(
            (id) => !elegidos.map((d) => d.IDDepartamento).includes(id),
         ),
      );
      setRightChecked([]);
   };

   // Renders
   const renderList = (
      title: string,
      items: Departamento[],
      checked: number[],
      setChecked: React.Dispatch<React.SetStateAction<number[]>>,
      searchValue: string,
      setSearch: React.Dispatch<React.SetStateAction<string>>,
   ) => (
      <div className="flex flex-col w-1/2 p-3 bg-white border rounded-lg shadow-sm">
         <h2 className="mb-2 text-lg font-semibold text-center">{title}</h2>
         <input
            type="search"
            placeholder="Buscar..."
            className="w-full px-2 py-1 mb-2 text-sm border rounded"
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
         />
         <ul className="overflow-y-auto text-sm max-h-80">
            {items.map((d) => (
               <li
                  key={d.IDDepartamento}
                  className="flex items-center justify-between px-2 py-1 mb-1 border-b rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                     if (checked.includes(d.IDDepartamento)) {
                        setChecked(
                           checked.filter((cid) => cid !== d.IDDepartamento),
                        );
                     } else {
                        setChecked([...checked, d.IDDepartamento]);
                     }
                  }}>
                  <span
                     className={`${checked.includes(d.IDDepartamento) && "font-bold"}`}>
                     {d.Nombre_CC}
                  </span>
                  <button className="font-bold transition">
                     {checked.includes(d.IDDepartamento) ? (
                        <icons.Lu.LuBookmarkCheck
                           size={25}
                           className="text-presidencia-claro"
                        />
                     ) : (
                        <icons.Lu.LuBookmark
                           size={25}
                           className="text-presidencia"
                        />
                     )}
                  </button>
               </li>
            ))}
            {items.length === 0 && (
               <li className="py-2 text-center text-gray-400">
                  Sin resultados
               </li>
            )}
         </ul>
      </div>
   );

   return (
      <div className="flex w-full gap-6 h-[25%] overflow-auto">
         {/* Disponibles */}
         {renderList(
            "Departamentos disponibles",
            disponibles,
            leftChecked,
            setLeftChecked,
            searchLeft,
            setSearchLeft,
         )}

         {/* Botones centrales */}
         <div className="flex flex-col items-center justify-center gap-2">
            <Tooltip content="Asignar seleccionados">
               <button
                  onClick={moveRight}
                  disabled={leftChecked.length === 0}
                  className="px-3 py-1 text-white rounded bg-presidencia disabled:opacity-40">
                  <icons.Fa.FaAngleRight />
               </button>
            </Tooltip>
            <Tooltip content="Asignar todos">
               <button
                  onClick={moveAllRight}
                  disabled={disponibles.length === 0}
                  className="px-3 py-1 text-white rounded bg-presidencia disabled:opacity-40">
                  <icons.Fa.FaAngleDoubleRight />
               </button>
            </Tooltip>
            <Tooltip content="Remover seleccionados">
               <button
                  onClick={moveLeft}
                  disabled={rightChecked.length === 0}
                  className="px-3 py-1 text-white rounded bg-presidencia disabled:opacity-40">
                  <icons.Fa.FaAngleLeft />
               </button>
            </Tooltip>
            <Tooltip content="Remover todos">
               <button
                  onClick={moveAllLeft}
                  disabled={elegidos.length === 0}
                  className="px-3 py-1 text-white rounded bg-presidencia disabled:opacity-40">
                  <icons.Fa.FaAngleDoubleLeft />
               </button>
            </Tooltip>
         </div>

         {/* Seleccionados */}
         {renderList(
            "Departamentos Asignados",
            elegidos,
            rightChecked,
            setRightChecked,
            searchRight,
            setSearchRight,
         )}
      </div>
   );
};

export default TransferList;
