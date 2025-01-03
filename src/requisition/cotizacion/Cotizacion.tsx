import { Dispatch, SetStateAction, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import Typography from "../../components/typografy/Typografy";
type CotizacionType = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setReloadTable: Dispatch<SetStateAction<boolean>>;
  
  };
const CotizacionComponent: React.FC<CotizacionType> = ({ open, setOpen,setReloadTable }) => {
  return (
    <ModalComponent
      open={open}
      setOpen={() => {
        setOpen(false);
      }}
    >
        <Typography variant="body">Cotización</Typography>
   

    </ModalComponent>
  );
};
export default CotizacionComponent