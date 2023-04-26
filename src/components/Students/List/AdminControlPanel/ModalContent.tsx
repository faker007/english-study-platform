import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { IModalContentArgs } from "../../../Common/Modal";
import { useState } from "react";
import { createUser } from "../../../../utils/Login";
import { STUDENT_COLLECTION } from "../../../../api/collections";
import { getDocs, query, where } from "firebase/firestore";
import ModalFrame from "../../../Common/Modal/ModalFrame";
import { 초기_패스워드_값_생성 } from "../../../../utils/Students";
import { useSetRecoilState } from "recoil";
import { isRefetchStudentListState } from "../../../../stores/students";

interface IModalContentForm {
  accountId: string;
  name: string;
  password: string;
  phoneNumber: string;
}

const AccountIdOptions: RegisterOptions = {
  required: true,
  minLength: 5,
};
const NameOptions: RegisterOptions = {
  required: true,
};
const PasswordOptions: RegisterOptions = {
  required: true,
  minLength: 5,
};
const PhoneNumberOptions: RegisterOptions = {
  required: true,
  pattern: /^[0-9]+$/,
};

const MIN_PASSWORD_LENGTH = 6;

export default function ModalContent({
  toggleOpen,
  isOpen,
}: IModalContentArgs) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<IModalContentForm>({ mode: "onChange" });
  const setIsRefetch = useSetRecoilState(isRefetchStudentListState);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<IModalContentForm> = async ({
    accountId,
    name,
    password,
    phoneNumber,
  }) => {
    setIsLoading(true);
    try {
      const { ok, error } = await createUser({
        accountId,
        password,
        role: "STUDENT",
        phoneNumber,
        name,
      });
      setIsLoading(false);

      if (ok) {
        alert("유저 생성 완료.");
        setIsRefetch(true);
        toggleOpen();
      } else {
        alert(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function checkStudentDuplicate() {
    if (!isEmailValidate) return false;

    try {
      const q = query(
        STUDENT_COLLECTION,
        where("accountId", "==", getValues("accountId"))
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 중복 발생
        alert("중복된 아이디입니다.");
        return false;
      }
      // 중복 없음
      alert("사용 가능한 아이디입니다.");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  function handleClickCreatePassword() {
    setValue("password", 초기_패스워드_값_생성(MIN_PASSWORD_LENGTH));
  }

  // 버튼 클릭 안되는 조건
  // 1. 아직 유저 입력을 받지 않음
  // 2. 에러가 남아있음.
  const isEmailValidate = dirtyFields.accountId && !errors.accountId;

  return (
    <ModalFrame title="학생 정보-등록" isOpen={isOpen} toggleOpen={toggleOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-fit flex-col"
      >
        <section aria-label="id-input" className="flex items-end gap-[12px]">
          <label
            htmlFor="id"
            className="h-[53px] w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]"
          >
            아이디
          </label>
          <div className="flex items-center gap-[10px] border-b border-[#777] pb-[5px]">
            <input
              id="id"
              type="text"
              placeholder="아이디는 영문/숫자 5자리 이상 입력"
              className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666]"
              {...register("accountId", AccountIdOptions)}
            />

            <button
              type="button"
              onClick={checkStudentDuplicate}
              disabled={!isEmailValidate}
              className="h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777] disabled:cursor-not-allowed"
            >
              중복 확인
            </button>
          </div>
        </section>
        <section aria-label="name-input" className="flex items-end gap-[12px]">
          <label
            htmlFor="name"
            className="h-[53px] w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]"
          >
            성명
          </label>
          <div className="flex items-center gap-[10px] border-b border-[#777] pb-[5px]">
            <input
              id="name"
              type="text"
              className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666]"
              {...register("name", NameOptions)}
            />
            <button
              type="button"
              disabled={true}
              className="invisible h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777]"
            ></button>
          </div>
        </section>
        <section
          aria-label="password-input"
          className="flex items-end gap-[12px]"
        >
          <label
            htmlFor="password"
            className="h-[53px] w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]"
          >
            비밀번호
          </label>
          <div className="flex items-center gap-[10px] border-b border-[#777] pb-[5px]">
            <input
              id="password"
              type="text"
              placeholder={`비밀번호는 영문/숫자 ${MIN_PASSWORD_LENGTH}자리 이상 입력`}
              className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666]"
              {...register("password", PasswordOptions)}
            />
            <button
              type="button"
              onClick={handleClickCreatePassword}
              className="h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777]"
            >
              초기 설정
            </button>
          </div>
        </section>
        <section
          aria-label="phoneNumber-input"
          className="flex items-end gap-[12px]"
        >
          <label
            htmlFor="phoneNumber"
            className="h-[53px] w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]"
          >
            연락처
          </label>
          <div className="flex items-center gap-[10px] border-b border-[#777] pb-[5px]">
            <input
              id="phoneNumber"
              type="text"
              placeholder="숫자만 입력해주세요."
              className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666]"
              {...register("phoneNumber", PhoneNumberOptions)}
            />
            <button
              type="button"
              disabled={true}
              className="invisible h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777]"
            ></button>
          </div>
        </section>
        <button
          type="submit"
          className="mx-auto mt-[30px] h-[36px] w-[82px] border border-[#007abe] bg-[#007abe] text-[13px] text-white"
        >
          {isLoading ? "저장중..." : "저장"}
        </button>
      </form>
    </ModalFrame>
  );
}
