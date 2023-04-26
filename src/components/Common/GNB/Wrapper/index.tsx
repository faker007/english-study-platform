import { Outlet, useNavigate } from "react-router-dom";
import GNB from "..";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../stores/user";

export default function GNBWrapper() {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return <></>;
  }

  return (
    <>
      <GNB role={user.role} />
      <Outlet />
    </>
  );
}
