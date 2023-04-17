import { useForm, SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import {
  ID_INPUT_OPTIONS,
  LOCALSTORAGE_ID_REMEBER,
  LOCALSTORAGE_USER_TOKEN,
  PASSWORD_INPUT_OPTIONS,
} from "../../../constants/Login";
import { ILoginForm } from "../../../types/Login";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IStudent, ITeacher, IUser, TUserRole } from "../../../api/models";
import { useCallback, useEffect, useState } from "react";
import {
  DocumentData,
  QuerySnapshot,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  STUDENT_COLLECTION,
  TEACHER_COLLECTION,
} from "../../../api/collections";
import { updateUserRecentLoginTime } from "../../../utils/Login";
import dayjs from "dayjs";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { userState } from "../../../stores/user";

interface IProps {
  role: TUserRole;
}

function LoginForm({ role }: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<ILoginForm>();
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);

  const onSubmit: SubmitHandler<ILoginForm> = async ({
    id,
    password,
    idRemember,
  }) => {
    setIsLoading(true);

    try {
      const userSnapshot = await getUserSnapshot({
        id,
        password,
        role,
        idRemember,
      });

      if (userSnapshot.empty) alert("해당하는 유저가 없습니다!");
      else await handleLogin({ navigate, role, setUser, userSnapshot });
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      reset();
    }

    setIsLoading(false);
  };

  const onInValid: SubmitErrorHandler<ILoginForm> = ({ id, password }) => {
    id?.message && alert(id.message);
    password?.message && alert(password.message);
  };

  const updateFormDataFromLocalstorage = useCallback(() => {
    const localstorageIdRemember = window.localStorage.getItem(
      LOCALSTORAGE_ID_REMEBER
    );

    if (localstorageIdRemember) {
      const parsedData = JSON.parse(localstorageIdRemember) as {
        role: TUserRole;
        id: string;
      };

      if (parsedData.role === role) {
        setValue("id", parsedData.id);
        setValue("idRemember", true);
      } else {
        reset();
      }
    }
  }, [role, setValue, reset]);

  useEffect(() => {
    updateFormDataFromLocalstorage();
  }, [updateFormDataFromLocalstorage]);

  return (
    <>
      <span className="text-[13px] leading-[30px] text-[#555]">
        아이디와 비밀번호를 입력해 주세요.
      </span>
      <form
        onSubmit={handleSubmit(onSubmit, onInValid)}
        className="mt-2 w-[280px] space-y-3"
      >
        <div className="space-y-2">
          <input
            type="text"
            className="h-[50px] w-full bg-[#f0f1f3] px-[20px] text-[14px] leading-[19px] text-[#999]"
            placeholder="아이디"
            {...register("id", ID_INPUT_OPTIONS)}
          />
          <input
            type="password"
            className="h-[50px] w-full bg-[#f0f1f3] px-[20px] text-[14px] leading-[19px] text-[#999]"
            placeholder="비밀번호"
            {...register("password", PASSWORD_INPUT_OPTIONS)}
          />
        </div>
        <div className="flex items-center gap-1">
          <input id="id-save" type={"checkbox"} {...register("idRemember")} />
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
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </>
  );
}

export default LoginForm;

async function getUserSnapshot({
  id,
  password,
  role,
}: ILoginForm & { role: TUserRole }) {
  const userQuery = query(
    role === "STUDENT" ? STUDENT_COLLECTION : TEACHER_COLLECTION,
    where("accountId", "==", id),
    where("password", "==", password)
  );
  return getDocs(userQuery);
}

async function handleLogin({
  role,
  userSnapshot,
  navigate,
  setUser,
}: {
  userSnapshot: QuerySnapshot<DocumentData>;
  role: TUserRole;
  navigate: NavigateFunction;
  setUser: SetterOrUpdater<IStudent | ITeacher | null>;
}) {
  const data = userSnapshot.docs[0].data() as IUser;

  localStorage.setItem(
    LOCALSTORAGE_USER_TOKEN,
    JSON.stringify({ role, data, createdAt: dayjs().toISOString() })
  );
  await updateUserRecentLoginTime(data);
  alert(`환영합니다 ${data.accountId}님`);
  navigate("/students/list");
  setUser(data);
}
