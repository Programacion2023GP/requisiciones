import React, { useState } from "react";
import { icons } from "../../constants";
import Tooltip from "../toltip/Toltip";

interface Departamento {
   id: number;
   nombre: string;
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
         !selected.includes(d.id) &&
         d.nombre.toLowerCase().includes(searchLeft.toLowerCase()),
   );
   const elegidos = departamentos.filter(
      (d) =>
         selected.includes(d.id) &&
         d.nombre.toLowerCase().includes(searchRight.toLowerCase()),
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
      updateSelected([...selected, ...disponibles.map((d) => d.id)]);
      setLeftChecked([]);
   };

   const moveLeft = () => {
      updateSelected(selected.filter((id) => !rightChecked.includes(id)));
      setRightChecked([]);
   };

   const moveAllLeft = () => {
      updateSelected(
         selected.filter((id) => !elegidos.map((d) => d.id).includes(id)),
      );
      setRightChecked([]);
   };

   // Renders
   const renderList = (
      items: Departamento[],
      checked: number[],
      setChecked: React.Dispatch<React.SetStateAction<number[]>>,
      searchValue: string,
      setSearch: React.Dispatch<React.SetStateAction<string>>,
   ) => (
      <div className="flex flex-col w-1/2 p-3 bg-white border rounded-lg shadow-sm">
         <h2 className="mb-2 font-semibold">Departamentos disponibles</h2>
         <input
            type="search"
            placeholder="Buscar..."
            className="px-2 py-1 text-sm border-b"
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
         />
         <ul className="flex-1 overflow-y-auto text-sm">
            {items.map((d) => (
               <li
                  key={d.id}
                  className="flex items-center px-2 py-1 hover:bg-gray-100">
                  <input
                     type="checkbox"
                     className="mr-2"
                     checked={checked.includes(d.id)}
                     onChange={(e) => {
                        if (e.target.checked) {
                           setChecked([...checked, d.id]);
                        } else {
                           setChecked(checked.filter((cid) => cid !== d.id));
                        }
                     }}
                  />
                  {d.nombre}
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
      <div className="flex w-full gap-6">
         {/* Disponibles */}
         {renderList(
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
                  className="px-3 py-1 text-white bg-blue-500 rounded disabled:opacity-40">
                  <icons.Fa.FaAngleRight />
               </button>
            </Tooltip>
            <Tooltip content="Asignar todos">
               <button
                  onClick={moveAllRight}
                  disabled={disponibles.length === 0}
                  className="px-3 py-1 text-white bg-blue-500 rounded disabled:opacity-40">
                  <icons.Fa.FaAngleDoubleRight />
               </button>
            </Tooltip>
            <Tooltip content="Remover seleccionados">
               <button
                  onClick={moveLeft}
                  disabled={rightChecked.length === 0}
                  className="px-3 py-1 text-white bg-blue-500 rounded disabled:opacity-40">
                  <icons.Fa.FaAngleLeft />
               </button>
            </Tooltip>
            <Tooltip content="Remover todos">
               <button
                  onClick={moveAllLeft}
                  disabled={elegidos.length === 0}
                  className="px-3 py-1 text-white bg-blue-500 rounded disabled:opacity-40">
                  <icons.Fa.FaAngleDoubleLeft />
               </button>
            </Tooltip>
         </div>

         {/* Seleccionados */}
         {renderList(
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
