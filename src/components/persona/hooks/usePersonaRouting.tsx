import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const usePersonaRouting = (setDialogOpen: (open: boolean) => void) => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === "/personas/create") {
      setDialogOpen(true);
    }
  }, [location.pathname, setDialogOpen]);
};