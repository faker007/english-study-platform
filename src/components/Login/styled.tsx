import { DEFAULT_IMAGE_DIR } from "../../constants";
import { UserRole } from "../api/models";
import LoginForm from "./Form";
import classNames from "classnames";

export function LoginSection({
  toggleRole,
  role,
}: {
  role: UserRole;
  toggleRole: () => void;
}) {
  const roleText = role === "STUDENT" ? "학생" : "강사";
  const roleChangeText = role === "STUDENT" ? "강사" : "학생";
  const BG_URL = `${DEFAULT_IMAGE_DIR}/login/form-bg.png`;

  return (
    <section
      style={{
        background: `url(${BG_URL}) 0 0 no-repeat`,
      }}
      className="relative h-[500px] w-full py-[50px] px-[30px]"
    >
      <div className="h-full w-[427px] space-y-5 pl-[60px]">
        <section>
          <LoginTitle roleText={roleText} />
        </section>
        <section>
          <LoginForm role={role} />
          <RoleChangeText
            roleChangeText={roleChangeText}
            toggleRole={toggleRole}
          />
        </section>
      </div>
    </section>
  );
}

export function CBTPrep({ role }: { role: UserRole }) {
  return (
    <section
      className={classNames("w-full", {
        "space-y-[135px]": role === "STUDENT",
        "space-y-0": role !== "STUDENT",
      })}
    >
      <h1
        style={{ textShadow: "1px 1px 1px #555" }}
        className="text-[90px] font-bold text-white"
      >
        {role === "STUDENT" && "CBT PREP"}
        {role === "TEACHER" && "CBT PREP ADMIN"}
      </h1>
      <img
        src={`${DEFAULT_IMAGE_DIR}/login/deco.png`}
        alt="deco"
        draggable={false}
        width={430}
        height={"auto"}
      />
    </section>
  );
}

export function LoginTitle({ roleText }: { roleText: string }) {
  return (
    <div className="flex items-start gap-5">
      <img
        src={`${DEFAULT_IMAGE_DIR}/icons/ico-lock.png`}
        alt="ico-lock"
        height={50}
        width={"auto"}
      />
      <h2 className="text-[40px] font-bold">{roleText} 로그인</h2>
      <img
        src={`${DEFAULT_IMAGE_DIR}/logo/gnb.jpeg`}
        alt="logo"
        width={100}
        height={"auto"}
      />
    </div>
  );
}

export function RoleChangeText({
  roleChangeText,
  toggleRole,
}: {
  toggleRole: () => void;
  roleChangeText: string;
}) {
  return (
    <div className="flex w-[280px] items-start gap-1 pt-5">
      <img
        src={`${DEFAULT_IMAGE_DIR}/icons/ico-alert.png`}
        width={16}
        height={"auto"}
        alt="ico-alert"
      />
      <span className="text-[12px] text-[#555]">
        아이디, 비밀번호, 분실등 기타 사항은 관리자에게 문의해 주세요.
        <strong onClick={toggleRole} className="cursor-pointer font-bold">
          [{roleChangeText} 로그인 바로가기]
        </strong>
      </span>
    </div>
  );
}
