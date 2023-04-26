import { ComponentType, useEffect } from "react";
import useUser from "../../../hooks/useUser";
import { isAdmin } from "../../../api/utils/teacher";
import { useNavigate } from "react-router-dom";

const withAdmin = <T extends object>(Component: ComponentType<T>) => {
  const WithAdmin: React.FC<T> = (props) => {
    const { user, isLoading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !user) {
        alert("유저 정보가 없습니다.");
        return navigate("/login");
      }

      if (!isAdmin(user)) {
        alert("어드민만 이용할 수 있습니다.");
        return navigate(-1);
      }
    }, [user, navigate, isLoading]);

    return <Component {...props} />;
  };

  return WithAdmin;
};

export default withAdmin;
