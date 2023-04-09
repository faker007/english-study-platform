import { useState } from "react";
import { LOGIN_BG_STUDENT, LOGIN_BG_TEACHER } from "../constants/Login";
import { CBTPrep, LoginSection } from "../components/Login/styled";
import { TUserRole } from "../api/models";

export default function Login() {
  const [role, setRole] = useState<TUserRole>("STUDENT");

  function toggleRole() {
    setRole((prev) => (prev === "STUDENT" ? "TEACHER" : "STUDENT"));
  }

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
