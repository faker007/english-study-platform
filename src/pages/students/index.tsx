import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Students() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname } = location;

    if (pathname === "/students") {
      navigate("/students/list");
    }
  }, [navigate, location]);

  return <Outlet />;
}
