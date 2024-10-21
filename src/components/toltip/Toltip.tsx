import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <span
        className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-12 mb-2 text-xs text-white bg-black rounded py-2 px-3 transition-opacity duration-900 ease-in-out 
                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      >
        {content}
      </span>
    </div>
  );
};

export default Tooltip;
