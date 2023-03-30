import { useState } from "react";
import { UserRole } from "../types";
import { LOGIN_BG_STUDENT, LOGIN_BG_TEACHER } from "../constants/Login";
import { DEFAULT_IMAGE_DIR } from "../constants";
import classNames from "classnames";

export default function Login() {
  const [role, setRole] = useState<UserRole | undefined>("STUDENT");

  function toggleRole() {
    setRole((prev) =>
      prev === "STUDENT"
        ? "TEACHER"
        : prev === "TEACHER" || prev === "ADMIN"
        ? "STUDENT"
        : undefined
    );
  }

  const roleText =
    role === "STUDENT"
      ? "학생"
      : role === "ADMIN" || role === "TEACHER"
      ? "강사"
      : "";

  const roleChangeText =
    role === "STUDENT"
      ? "강사"
      : role === "ADMIN" || role === "TEACHER"
      ? "학생"
      : "";

  return (
    <div
      style={{
        backgroundImage: `url(${
          role === "STUDENT"
            ? LOGIN_BG_STUDENT
            : role === "ADMIN" || role === "TEACHER"
            ? LOGIN_BG_TEACHER
            : ""
        })`,
      }}
      className="flex min-h-screen w-full items-center bg-cover bg-center"
    >
      <main className="mx-auto flex w-full max-w-[1000px]">
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
        <section
          style={{
            background: `url(${DEFAULT_IMAGE_DIR}/login/form-bg.png) 0 0 no-repeat`,
          }}
          className="relative h-[500px] w-full py-[50px] px-[30px]"
        >
          <div className="h-full w-[427px] space-y-5 pl-[60px]">
            <section className="flex items-start gap-5">
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
            </section>
            <section>
              <span className="text-[13px] leading-[30px] text-[#555]">
                아이디와 비밀번호를 입력해 주세요.
              </span>
              <form className="mt-2 w-[280px] space-y-3">
                <div className="space-y-2">
                  <input
                    type="text"
                    className="h-[50px] w-full bg-[#f0f1f3] px-[20px] text-[14px] leading-[19px] text-[#999]"
                    placeholder="아이디"
                  />
                  <input
                    type="text"
                    className="h-[50px] w-full bg-[#f0f1f3] px-[20px] text-[14px] leading-[19px] text-[#999]"
                    placeholder="비밀번호"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <input id="id-save" type={"checkbox"} />
                  <label
                    htmlFor="id-save"
                    className="select-none text-[11px] text-[#666]"
                  >
                    아이디 저장
                  </label>
                </div>
                <button
                  type="submit"
                  className="h-[50px] w-full bg-[#28428e] text-[18px] font-bold text-white"
                >
                  로그인
                </button>
              </form>
              <div className="flex w-[280px] items-start gap-1 pt-5">
                <img
                  src={`${DEFAULT_IMAGE_DIR}/icons/ico-alert.png`}
                  width={16}
                  height={"auto"}
                  alt="ico-alert"
                />
                <span className="text-[12px] text-[#555]">
                  아이디, 비밀번호, 분실등 기타 사항은 관리자에게 문의해 주세요.
                  <strong
                    onClick={toggleRole}
                    className="cursor-pointer font-bold"
                  >
                    [{roleChangeText} 로그인 바로가기]
                  </strong>
                </span>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
