import { UserRole } from "../../../types";
import AuthMenu from "./AuthMenu";
import StudentMenu from "./Menu/StudentMenu";
import TeacherMenu from "./Menu/TeacherMenu";

interface IProps {
  role: UserRole;
}

export default function GNB({ role }: IProps) {
  return (
    <header className="mb-[30px] w-full">
      <AuthMenu />
      {role === "STUDENT" && <StudentMenu />}
      {role === "TEACHER" && <TeacherMenu />}
      {role === "ADMIN" && <TeacherMenu />}
    </header>
  );
}
