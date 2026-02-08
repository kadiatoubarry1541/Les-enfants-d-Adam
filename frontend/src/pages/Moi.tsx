import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Moi() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige vers le dashboard unifié
    navigate("/compte", { replace: true });
  }, [navigate]);

  return null;
}
