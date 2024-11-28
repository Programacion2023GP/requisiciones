import React, { memo } from "react";

type HeaderComponentProps = {
  button?: React.ReactNode;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({ button }) => {
  console.log("HEADER Component");

  return (
    <div className="bg-presidencia w-full h-full p-4 shadow-lg flex items-center justify-between">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">

      {button}
      </div>

      {/* Navigation Section */}
    

      {/* Mobile Menu and Button Section */}
    
    </div>
  );
};

export default memo(HeaderComponent);
