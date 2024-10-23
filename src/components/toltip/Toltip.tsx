import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
<div
  className="relative box-content inline-block"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  {children}
  <span
    className={`absolute z-40 right-full w-40  top-1/2 transform -translate-y-1/2 mr-2 text-xs text-white bg-black rounded py-2 px-3 transition-opacity duration-300 ease-in-out 
                ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    style={{ pointerEvents: 'none' }} // Evita interferencias con el hover del padre
  >
    {content}
  </span>
</div>



  
  
  );
};

export default Tooltip;
