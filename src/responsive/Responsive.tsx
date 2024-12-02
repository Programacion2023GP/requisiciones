import React, { memo, useEffect } from "react";
import { ColProps, RowProps } from "./types";
import './responsive.css'
export const RowComponent: React.FC<RowProps> = ({ children }) => {
  return (
    <div className="flex flex-row flex-wrap w-full ">
      {children}
    </div>
  );
};
  
 // ColComponent.tsx



// ColComponent con clases responsivas usando las clases definidas en CSS
export const ColComponent: React.FC<ColProps> = ({
  children,
  responsive = { sm: 12, md: 12, lg: 12, xl: 12, "2xl": 12 },
  autoPadding=true,
  ...props
}) => {
  // useEffect(()=>{
  // },[responsive])
  return (
    <div
      className={`col sm-${responsive.sm} md-${responsive.md} lg-${responsive.lg} xl-${responsive.xl} xl2-${responsive["2xl"]} ${autoPadding && 'pl-4 pr-4'}  `}
      {...props}
    >
      {children}
    </div>
  );
};

  
  
  // RowComponent.tsx
  
 