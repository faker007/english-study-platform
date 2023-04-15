import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { IModalContentArgs } from "../../../Common/Modal";
import { useContext } from "react";
import { RefetchStudentListContext } from "../../../../pages/students/list";
import { createUser } from "../../../../utils/Login";
import { USER_COLLECTION } from "../../../../api/collections";
import { getDocs, query, where } from "firebase/firestore";

interface IModalContentForm {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
}

const EmailOptions: RegisterOptions = {
  required: true,
  minLength: 5,
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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

export default function ModalContent({ toggleOpen }: IModalContentArgs) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<IModalContentForm>({ mode: "onChange" });
  const { refetch } = useContext(RefetchStudentListContext);

  const onSubmit: SubmitHandler<IModalContentForm> = async ({
    email,
    name,
    password,
    phoneNumber,
  }) => {
    try {
      if (!(await 이메일_중복_확인()))
        return alert("입력한 데이터에 문제가 있습니다.");

      const isOk = await createUser({
        id: email,
        idRemember: false,
        password,
        role: "STUDENT",
        phoneNumber,
        name,
      });

      if (isOk) {
        alert("유저 생성 완료.");
        await refetch();
        toggleOpen();
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function 이메일_중복_확인() {
    if (!isEmailValidate) return false;

    try {
      const q = query(
        USER_COLLECTION,
        where("email", "==", getValues("email"))
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

  function 초기_패스워드_값_생성() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < MIN_PASSWORD_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    setValue("password", result);
  }

  // 버튼 클릭 안되는 조건
  // 1. 아직 유저 입력을 받지 않음
  // 2. 에러가 남아있음.
  const isEmailValidate = dirtyFields.email && !errors.email;

  return (
    <div className="h-full w-full overflow-hidden rounded-[10px] bg-white p-[20px]">
      <header className="flex w-full items-center justify-between px-[20px] pt-[20px] pb-[20px]">
        <h3 className="text-2xl font-medium">학생 정보-등록</h3>
        <button
          onClick={toggleOpen}
          className="text-3xl font-medium text-[#555]"
        >
          X
        </button>
      </header>
      <main className="w-full border-t-[3px] border-[#333] p-[30px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex w-fit flex-col"
        >
          <section
            aria-label="email-input"
            className="flex items-end gap-[12px]"
          >
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
                placeholder="아이디는 이메일 형태, 영문/숫자 5자리 이상 입력"
                className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666]"
                {...register("email", EmailOptions)}
              />

              <button
                type="button"
                onClick={이메일_중복_확인}
                disabled={!isEmailValidate}
                className="h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777] disabled:cursor-not-allowed"
              >
                중복 확인
              </button>
            </div>
          </section>
          <section
            aria-label="name-input"
            className="flex items-end gap-[12px]"
          >
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
                onClick={초기_패스워드_값_생성}
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
            저장
          </button>
        </form>
      </main>
    </div>
  );
}
