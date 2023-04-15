import { SubmitHandler, useForm } from "react-hook-form";
import { IModalContentArgs } from "../../../Common/Modal";
import { useContext } from "react";
import { RefetchStudentListContext } from "../../../../pages/students/list";
import { doc, updateDoc } from "firebase/firestore";
import { fbAuth, fbStore } from "../../../../firebase";
import { 초기_패스워드_값_생성 } from "../../../../utils/Students";
import ModalFrame from "../../../Common/Modal/ModalFrame";
import { signOut, updateCurrentUser } from "firebase/auth";

const EnabledTypes = {
  ENABLED: "ENABLED",
  DISABLED: "DISABLED",
} as const;

type EnabledType = keyof typeof EnabledTypes;

interface IForm {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  enabled: EnabledType;
}

interface IModalContentProps extends IModalContentArgs {
  email: string;
  name: string;
  phoneNumber: string;
  isEnabled: boolean;
  docId: string;
}

const MIN_PASSWORD_LENGTH = 6;

export default function ModalContent({
  toggleOpen,
  isOpen,
  email,
  name,
  phoneNumber,
  isEnabled,
  docId,
}: IModalContentProps) {
  const { register, handleSubmit, setValue } = useForm<IForm>({
    defaultValues: {
      email,
      name,
      phoneNumber,
      enabled: isEnabled ? EnabledTypes.ENABLED : EnabledTypes.DISABLED,
    },
  });
  const { refetch } = useContext(RefetchStudentListContext);

  const onSubmit: SubmitHandler<IForm> = async ({
    enabled,
    name,
    password,
    phoneNumber,
  }) => {
    try {
      const targetDoc = doc(fbStore, "user", docId);

      await updateDoc(targetDoc, {
        name,
        phoneNumber,
        isEnabled: enabled === "ENABLED",
      });

      // todo: update password if needed.

      alert("업데이트 완료.");
      await refetch();
      toggleOpen();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickCreatePassword = () => {
    setValue("password", 초기_패스워드_값_생성(MIN_PASSWORD_LENGTH));
  };

  return (
    <ModalFrame title="학생 정보-수정 " isOpen={isOpen} toggleOpen={toggleOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-fit flex-col"
      >
        <section aria-label="email-input" className="flex items-end gap-[12px]">
          <label
            htmlFor="email"
            className="h-[53px] w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]"
          >
            아이디
          </label>
          <div className="flex items-center gap-[10px] border-b border-[#777] pb-[5px]">
            <input
              id="email"
              type="email"
              readOnly
              placeholder="아이디는 이메일 형태, 영문/숫자 5자리 이상 입력"
              className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666] outline-none"
              {...register("email")}
            />

            <button
              type="button"
              disabled={true}
              className="invisible h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777] disabled:cursor-not-allowed"
            ></button>
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
              {...register("name")}
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
              placeholder="변경시에만 입력해주세요."
              className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666]"
              {...register("password")}
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
              {...register("phoneNumber")}
            />
            <button
              type="button"
              disabled={true}
              className="invisible h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777]"
            ></button>
          </div>
        </section>
        <section aria-label="enabled-radio" className="flex gap-[12px]">
          <label className="h-[53px] w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]">
            사용여부
          </label>
          <div className="flex flex-1 items-center gap-[10px] border-b border-[#777] pb-[5px]">
            <div>
              <input
                type="radio"
                id={EnabledTypes.ENABLED}
                value={EnabledTypes.ENABLED}
                {...register("enabled")}
              />
              <label htmlFor={EnabledTypes.ENABLED}>사용</label>
            </div>
            <div>
              <input
                type="radio"
                id={EnabledTypes.DISABLED}
                value={EnabledTypes.DISABLED}
                {...register("enabled")}
              />
              <label htmlFor={EnabledTypes.DISABLED}>정지</label>
            </div>
          </div>
        </section>
        <button
          type="submit"
          className="mx-auto mt-[30px] h-[36px] w-[82px] border border-[#007abe] bg-[#007abe] text-[13px] text-white"
        >
          저장
        </button>
      </form>
    </ModalFrame>
  );
}
