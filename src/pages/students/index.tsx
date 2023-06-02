import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import withTeacher from "../../components/Common/HOC/withTeacher";

function Students() {
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

export default withTeacher(Students);
