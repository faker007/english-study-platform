import { useState } from "react";
import { IStudent, ITeacher, TUserRole } from "../../../../api/models";
import { DEFAULT_IMAGE_DIR } from "../../../../constants";
import useUser from "../../../../hooks/useUser";
import Modal, { IModalContentArgs } from "../../Modal";
import ModalFrame from "../../Modal/ModalFrame";
import { useForm } from "react-hook-form";
import { 초기_패스워드_값_생성 } from "../../../../utils/Students";
import { COLLECTIONS } from "../../../../api/constants";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../firebase";
import dayjs from "dayjs";
import { LOCALSTORAGE_USER_TOKEN } from "../../../../constants/Login";
import { useNavigate } from "react-router-dom";

interface IProps {
  role: TUserRole;
}

export default function AuthMenu({ role }: IProps) {
  const { user, setUser, refetch: refetchUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function toggleOpen() {
    setIsOpen((prev) => !prev);
  }

  function handleClickSignOut() {
    // todo: remove localStorage token and refresh user's data
    window.localStorage.removeItem(LOCALSTORAGE_USER_TOKEN);
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-defualt-container items-center justify-between">
      <section>
        <img
          src={`${DEFAULT_IMAGE_DIR}/logo/gnb.jpeg`}
          className="h-[40px] w-auto"
          alt="gnb-logo"
        />
      </section>
      <section className="inline-flex items-center gap-[48px]">
        <div>
          <span className="text-[13px] text-[#111]">
            {user?.name}[{user?.accountId}]님
          </span>
        </div>
        <div className="inline-flex gap-[12px]">
          <button className="flex items-center gap-1" onClick={toggleOpen}>
            <img
              className="aspect-square w-[20px]"
              src={`${DEFAULT_IMAGE_DIR}/icons/ico-info-change.png`}
              alt="ico-info-change"
            />
            <span className="text-[13px] text-[#555]">개인정보 변경</span>
          </button>
          <button
            onClick={handleClickSignOut}
            className="flex items-center gap-1"
          >
            <img
              className="aspect-square w-[20px]"
              src={`${DEFAULT_IMAGE_DIR}/icons/ico-logout.png`}
              alt="ico-logout"
            />
            <span className="text-[13px] text-[#555]">로그아웃</span>
          </button>
        </div>
      </section>
      {user && (
        <Modal isOpen={isOpen} toggleOpen={toggleOpen} width={700} height={500}>
          {(modalProps) => (
            <ModalContent
              user={user}
              refetchUser={refetchUser}
              role={role}
              {...modalProps}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

interface IForm {
  accountId: string;
  name: string;
  password: string;
  phoneNumber: string;
}

function ModalContent({
  isOpen,
  toggleOpen,
  role,
  user,
  refetchUser,
}: IModalContentArgs & {
  role: TUserRole;
  user: ITeacher | IStudent;
  refetchUser: (role?: "STUDENT" | "TEACHER" | undefined) => Promise<void>;
}) {
  const modalTitle = role === "STUDENT" ? "학생 정보-수정" : "강사 정보-수정";
  const { register, handleSubmit, setValue, reset } = useForm<IForm>({
    defaultValues: {
      accountId: user.accountId,
      name: user.name,
      password: "",
      phoneNumber: user.phoneNumber,
    },
  });

  async function onSubmit({ accountId, name, password, phoneNumber }: IForm) {
    try {
      // todo: update firestore based on role
      const targetCollection =
        role === "STUDENT" ? COLLECTIONS.student : COLLECTIONS.teacher;

      const targetDoc = doc(fbStore, targetCollection, user.id);
      const targetObj = await getDoc(targetDoc);

      if (targetObj.exists()) {
        // update doc's properties based on form data
        await updateDoc(targetDoc, {
          accountId,
          name,
          phoneNumber,
          updatedAt: dayjs().toISOString(),
          ...(password && { password }),
        });
        await refetchUser(role);
        window.location.reload();
      }
      alert("성공적으로 수정되었습니다.");
      toggleOpen();
    } catch (error) {
      console.error(error);
      alert("에러가 발생하였습니다.");
    }
  }

  function handleClickCreatePassword() {
    setValue("password", 초기_패스워드_값_생성(6));
  }

  function closeModal() {
    reset();
    toggleOpen();
  }

  return (
    <ModalFrame title={modalTitle} isOpen={isOpen} toggleOpen={toggleOpen}>
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
              readOnly
              placeholder="아이디는 이메일 형태, 영문/숫자 5자리 이상 입력"
              className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666] outline-none"
              {...register("accountId", { required: true })}
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
              {...register("phoneNumber", { required: true })}
            />
            <button
              type="button"
              disabled={true}
              className="invisible h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777]"
            ></button>
          </div>
        </section>
        <section className="mx-auto mt-[30px] space-x-3">
          <button
            type="submit"
            className="h-[36px] w-[82px] border border-[#007abe] bg-[#007abe] text-[13px] text-white"
          >
            저장
          </button>
          <button
            onClick={closeModal}
            type="button"
            className="h-[36px] w-[82px]  border border-black bg-white text-[13px] text-black"
          >
            닫기
          </button>
        </section>
      </form>
    </ModalFrame>
  );
}
