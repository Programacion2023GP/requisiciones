import { useState, useCallback } from "react";

const OpenHook = () => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return {
    open,
    toggleOpen,
  };
};

export default OpenHook;
