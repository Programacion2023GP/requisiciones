import React, { useState } from "react";
import { InputComponet } from "./InputInterface";

export const InputComponent:React.FC<InputComponet> = ({label,setValue,value}) => {
    // const [value,setValue] = useState<string>("")
    return (
        <div className="relative w-full">
        <input
          onChange={
            (e) => {
              setValue(e.target.value);
            }
          }
          type="text"
          id="enhancedFloatingInput"
          placeholder=" "
          className="peer block w-full appearance-none border-2 border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-900 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-600 transition-all duration-300"
          
        />
        <label
          htmlFor="enhancedFloatingInput"
          className="absolute left-2 top-2 text-sm text-gray-500 transition-all duration-300 transform scale-100 origin-[0] bg-white px-2 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:left-4 peer-focus:scale-75 peer-focus:-translate-y-1 peer-focus:text-blue-600"
        >
          {label}
        </label>
      </div>
      
    );
};