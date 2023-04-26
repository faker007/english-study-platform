import { SubmitHandler, useForm } from "react-hook-form";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { useSetRecoilState } from "recoil";
import { ITeacher, ITeacherGroup } from "../../../../api/models";
import { IModalContentArgs } from "../../../Common/Modal";
import {
  isRefetchTeacherGroupListState,
  isRefetchTeacherListState,
} from "../../../../stores/teachers";
import { fbStore } from "../../../../firebase";
import { COLLECTIONS } from "../../../../api/constants";
import { 초기_패스워드_값_생성 } from "../../../../utils/Students";
import ModalFrame from "../../../Common/Modal/ModalFrame";
import useTeacherGroupList from "../../../../hooks/useTeacherGroupList";
import { useEffect } from "react";

const EnabledTypes = {
  ENABLED: "ENABLED",
  DISABLED: "DISABLED",
} as const;

type EnabledType = keyof typeof EnabledTypes;

interface IForm {
  accountId: string;
  name: string;
  password: string;
  phoneNumber: string;
  groupId: string;
  enabled: EnabledType;
}

interface IModalContentProps extends IModalContentArgs {
  teacher: ITeacher;
}

const MIN_PASSWORD_LENGTH = 6;

export default function ModalContent({
  toggleOpen,
  isOpen,
  teacher,
}: IModalContentProps) {
  const { accountId, name, phoneNumber, isEnabled, id, groupIDs } = teacher;
  const { register, handleSubmit, setValue } = useForm<IForm>({
    defaultValues: {
      accountId,
      name,
      phoneNumber,
      enabled: isEnabled ? EnabledTypes.ENABLED : EnabledTypes.DISABLED,
    },
  });

  // recoil
  const setRefetchTeacherList = useSetRecoilState(isRefetchTeacherListState);
  const setRefetchTeacherGroupList = useSetRecoilState(
    isRefetchTeacherGroupListState
  );

  // hooks
  const { teacherGroups, isLoading: isLoadingTeacherGroupList } =
    useTeacherGroupList({ searchQuery: "" });

  // funcs
  async function updateTeacher({
    enabled,
    groupId,
    name,
    password,
    phoneNumber,
  }: IForm) {
    const targetDoc = doc(fbStore, COLLECTIONS.teacher, id);

    await updateDoc(targetDoc, {
      name,
      phoneNumber,
      isEnabled: enabled === "ENABLED",
      updatedAt: dayjs().toISOString(),
      groupIDs: groupId ? [groupId] : [],
      ...(password && { password }),
    });
  }

  async function updateTargetTeacherGroup({ groupId }: { groupId: string }) {
    const groupDoc = doc(fbStore, COLLECTIONS.teacherGroup, groupId);
    const groupObj = await getDoc(groupDoc);

    if (groupObj.exists()) {
      const groupData = groupObj.data() as ITeacherGroup;
      const teacherIDs = Array.from(
        new Set([...groupData.teacherIDs, teacher.id])
      );

      await updateDoc(groupDoc, { teacherIDs });
    }
  }

  async function updatePrevTeacherGroup() {
    const [teacherGroupId] = teacher.groupIDs;
    const teacherGroupDoc = doc(
      fbStore,
      COLLECTIONS.teacherGroup,
      teacherGroupId
    );

    const teacherGroupObj = await getDoc(teacherGroupDoc);

    if (teacherGroupObj.exists()) {
      const teacherGroupData = teacherGroupObj.data() as ITeacherGroup;
      const teacherIDs = teacherGroupData.teacherIDs.filter(
        (teacherId) => teacherId !== teacher.id
      );

      await updateDoc(teacherGroupDoc, { teacherIDs });
    }
  }

  const onSubmit: SubmitHandler<IForm> = async ({
    enabled,
    name,
    password,
    phoneNumber,
    groupId,
  }) => {
    try {
      await updateTeacher({
        accountId,
        enabled,
        groupId,
        name,
        password,
        phoneNumber,
      });

      if (groupId) {
        // 만약 이전에 있던 그룹이 존재한다면, 해당 그룹의 teacherIDs에서 현재 선생님 아이디를 빼줘야함.
        if (teacher.groupIDs.length > 0) await updatePrevTeacherGroup();

        await updateTargetTeacherGroup({ groupId });
      }

      alert("업데이트 완료.");
      setRefetchTeacherList(true);
      setRefetchTeacherGroupList(true);
      toggleOpen();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickCreatePassword = () => {
    setValue("password", 초기_패스워드_값_생성(MIN_PASSWORD_LENGTH));
  };

  // effects
  useEffect(() => {
    function updateDefaultGroupId() {
      if (!isLoadingTeacherGroupList && groupIDs.length > 0)
        setValue("groupId", groupIDs[0]);
    }

    updateDefaultGroupId();
  }, [isLoadingTeacherGroupList, groupIDs, setValue]);

  return (
    <ModalFrame title="강사 계정-수정" isOpen={isOpen} toggleOpen={toggleOpen}>
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
              {...register("accountId")}
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
        <section aria-label="teacher-group-input" className="flex gap-[12px]">
          <label
            htmlFor="teacherGroup"
            className="h-[53px] w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]"
          >
            강사 그룹
          </label>
          <div className="flex flex-1 items-center gap-[10px] border-b border-[#777] pb-[5px]">
            <select
              className="border border-zinc-500 p-1 text-sm"
              {...register("groupId")}
            >
              <option value={""}>(그룹 없음)</option>
              {teacherGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
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
