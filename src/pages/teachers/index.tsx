import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import withTeacher from "../../components/Common/HOC/withTeacher";
import withAdmin from "../../components/Common/HOC/withAdmin";

function Teachers() {
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

export default withTeacher(withAdmin(Teachers));
