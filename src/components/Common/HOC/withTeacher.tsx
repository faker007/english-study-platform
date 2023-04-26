import { ComponentType, useEffect } from "react";
import useUser from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";

const withTeacher = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithTeacher: React.FC<P> = (props) => {
    const { user, isLoading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !user) {
        alert("유저 정보가 없습니다.");
        navigate("/login");
      }

      if (user?.role !== "TEACHER") {
        alert("선생님만 이용할 수 있습니다.");
        navigate(-1);
      }
    }, [user, navigate, isLoading]);

    return <WrappedComponent {...props} />;
  };

  return WithTeacher;
};

export default withTeacher;
