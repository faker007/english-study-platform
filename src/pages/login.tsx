import { useEffect, useState } from "react";
import { LOGIN_BG_STUDENT, LOGIN_BG_TEACHER } from "../constants/Login";
import { CBTPrep, LoginSection } from "../components/Login/styled";
import { TUserRole } from "../api/models";
import { useRecoilValue } from "recoil";
import { userState } from "../stores/user";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState<TUserRole>("STUDENT");
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  function toggleRole() {
    setRole((prev) => (prev === "STUDENT" ? "TEACHER" : "STUDENT"));
  }

  useEffect(() => {
    if (user) {
      alert("로그인한 상태로 로그인 페이지에는 접근할 수 없습니다.");
      navigate("/");
    }
  }, [user, navigate]);

  const BG_URL =
    role === "STUDENT"
      ? LOGIN_BG_STUDENT
      : role === "TEACHER"
      ? LOGIN_BG_TEACHER
      : "";

  return (
    <div
      style={{
        backgroundImage: `url(${BG_URL})`,
      }}
      className="flex min-h-screen w-full items-center bg-cover bg-center"
    >
      <main className="mx-auto flex w-full max-w-[1000px]">
        <CBTPrep role={role} />
        <LoginSection role={role} toggleRole={toggleRole} />
      </main>
    </div>
  );
}
