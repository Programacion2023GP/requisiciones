import React, { memo } from "react";

type HeaderComponentProps = {
  button?: React.ReactNode;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({ button }) => {

  return (
    <div className="bg-presidencia w-full h-full p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center space-x-3">

      {button}
      </div>

   
    
    </div>
  );
};

export default memo(HeaderComponent);
