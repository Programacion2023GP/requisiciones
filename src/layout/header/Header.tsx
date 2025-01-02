import React, { memo } from "react";
import Typography from "../../components/typografy/Typografy";

type HeaderComponentProps = {
  button?: React.ReactNode;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({ button }) => {

  return (
    <div className="bg-presidencia w-full h-full p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center space-x-3">

      {button}
      </div>

      <div className="flex items-end space-x-3">
      <Typography className="shadow-md" color="white" size="4xl" variant="h2">
        {localStorage.getItem('name')}
      </Typography>
      
      </div>
    
    </div>
  );
};

export default memo(HeaderComponent);
