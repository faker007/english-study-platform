import { DEFAULT_IMAGE_DIR } from "..";
import { RegisterOptions } from "react-hook-form";

export const LOGIN_BG_STUDENT = `${DEFAULT_IMAGE_DIR}/login/student.png`;
export const LOGIN_BG_TEACHER = `${DEFAULT_IMAGE_DIR}/login/teacher.png`;

export const ID_INPUT_OPTIONS: RegisterOptions = {
  required: {
    value: true,
    message: "아이디를 입력해 주세요.",
  },
};

export const PASSWORD_INPUT_OPTIONS: RegisterOptions = {
  required: {
    value: true,
    message: "비밀번호를 입력해 주세요.",
  },
};

export const LOCALSTORAGE_ID_REMEBER = "ID_REMEMBER";
