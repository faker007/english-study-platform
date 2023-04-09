import { useForm, SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import {
  ID_INPUT_OPTIONS,
  LOCALSTORAGE_ID_REMEBER,
  PASSWORD_INPUT_OPTIONS,
} from "../../../constants/Login";
import { ILoginForm } from "../../../types/Login";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fbAuth, fbStore } from "../../../firebase";
import { TUserRole } from "../../../api/models";
import {
  checkUserRole,
  getUserFromFirestore,
  updateLocalstorageIdRemember,
  updateUserRecentLoginTime,
} from "../../../utils/Login";
import { useCallback, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

interface IProps {
  role: TUserRole;
}

export default function LoginForm({ role }: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<ILoginForm>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ILoginForm> = async ({
    id,
    password,
    idRemember,
  }) => {
    setIsLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(fbAuth, id, password);

      if (user) {
        const firestoreUserData = await getUserFromFirestore(user.uid);
        const isRoleValidate = checkUserRole({ role, user: firestoreUserData });

        if (firestoreUserData && isRoleValidate) {
          updateLocalstorageIdRemember({
            id: firestoreUserData?.email || "",
            idRemember,
            role,
          });

          await updateUserRecentLoginTime(firestoreUserData);

          alert(`환영합니다 ${firestoreUserData?.email}님`);
          navigate("/");
        } else {
          alert("로그인 방식에 문제가 있습니다.");
        }
      }
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
