import { TUserRole } from "../../../api/models";
import AuthMenu from "./AuthMenu";
import StudentMenu from "./Menu/StudentMenu";
import TeacherMenu from "./Menu/TeacherMenu";

interface IProps {
  role: TUserRole;
}

export default function GNB({ role }: IProps) {
  return (
    <header className="mb-[30px] w-full">
      <AuthMenu role={role} />
      {role === "STUDENT" && <StudentMenu />}
      {role === "TEACHER" && <TeacherMenu />}
    </header>
  );
}
