import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Teachers() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname } = location;

    if (pathname === "/teachers") {
      navigate("/teachers/list");
    }
  }, [navigate, location]);

  return <Outlet />;
}
