import React, { useEffect, useState } from "react";

type SwitchType = {
 enabled: boolean,
  enabledColor?: string;
  disabledColor?: string;
  onclick: () => void;
  label: string; // Prop para el mensaje del label
};

const SwitchComponent: React.FC<SwitchType> = ({
  disabledColor,
  enabledColor,
  onclick,
  enabled = false, // Estado inicial del switch
  label, // Recibimos el mensaje del label
}) => {
    useEffect(()=>{},[enabled]);
  return (
    <>
      <span className="text-sm text-gray-600">{label}</span>

      <div className="relative z-0 w-full mt-2 mb-5 flex items-center">
        <div className="w-full flex items-center justify-center">
          <label className="inline-flex relative items-center cursor-pointer w-full">
            <input
              type="checkbox"
              className="sr-only" // Hide the native checkbox
              onChange={() => {
                onclick();
              }}
            />
            <div
              className={`w-full h-6 bg-gray-200 rounded-full transition-all duration-1000 ${
                enabled ? enabledColor : disabledColor
              }`}
            >
              <div
                className={`dot absolute top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all duration-1000 ease-in-out ${
                  enabled ? "right-1" : "left-1"
                }`}
              />
            </div>
            {/* Aquí agregamos el label con el mensaje */}
          </label>
        </div>
      </div>
    </>
  );
};

export default SwitchComponent;
