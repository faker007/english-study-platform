import { SubmitHandler, useForm } from "react-hook-form";
import { IModalContentArgs } from "../../../../Common/Modal";
import ModalFrame from "../../../../Common/Modal/ModalFrame";
import useStudentGroupList from "../../../../../hooks/useStudentGroupList";
import { doc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../../firebase";
import { COLLECTIONS } from "../../../../../api/constants";
import { IStudentGroup } from "../../../../../api/models";
import { useSetRecoilState } from "recoil";
import {
  isRefetchStudentGroupListState,
  isRefetchStudentListState,
} from "../../../../../stores/students";
import { useState } from "react";

interface IProps extends IModalContentArgs {
  accountId: string;
  name: string;
  isEnabled: boolean;
  phoneNumber: string;
  docId: string;
  groupIDs: string[];
}

interface IForm {
  checkbox: string[];
}

export default function ModalContent({
  isOpen,
  toggleOpen,
  accountId,
  docId,
  groupIDs,
  name,
}: IProps) {
  const { register, handleSubmit } = useForm<IForm>();
  const { isLoading, groups } = useStudentGroupList();
  const setIsRefetchStudentList = useSetRecoilState(isRefetchStudentListState);
  const setIsRefetchStudentGroupList = useSetRecoilState(
    isRefetchStudentGroupListState
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const onSubmit: SubmitHandler<IForm> = async ({ checkbox }) => {
    setIsSubmitLoading(true);

    try {
      const disconnectGroups = groups.filter((group) => {
        const isGroupMember = group.studentIDs.includes(docId);
        const isSelected = checkbox.includes(group.id);

        return isGroupMember && !isSelected;
      });

      await Promise.all([
        ..._disconnectGroups(disconnectGroups, docId),
        connectGroups(checkbox, docId),
      ]);
      setIsRefetchStudentGroupList(true);
      setIsRefetchStudentList(true);
      alert("성공적으로 연결했습니다.");
      toggleOpen();
    } catch (error) {
      console.error(error);
    }

    setIsSubmitLoading(false);
  };

  function _disconnectGroups(groupIDs: IStudentGroup[], studentId: string) {
    return groupIDs.map((group) => disconnectGroup(group.id, studentId));
  }

  async function disconnectGroup(groupId: string, studentId: string) {
    const studentDoc = doc(fbStore, COLLECTIONS.student, studentId);
    const groupDoc = doc(fbStore, COLLECTIONS.studentGroup, groupId);

    const groupObj = groups.find((group) => group.id === groupId);

    if (groupObj) {
      await Promise.all([
        updateDoc(studentDoc, {
          groupIDs: groupIDs.filter((id) => id !== groupId),
        }),
        updateDoc(groupDoc, {
          studentIDs: groupObj.studentIDs.filter((id) => id !== studentId),
        }),
      ]);
    }
  }

  async function connectGroups(groupIDs: string[], studentId: string) {
    const studentDoc = doc(fbStore, COLLECTIONS.student, studentId);

    const groupPromises = groupIDs.map(async (groupId) => {
      const groupDoc = doc(fbStore, COLLECTIONS.studentGroup, groupId);
      const groupObj = groups.find((group) => group.id === groupId);

      if (groupObj) {
        const isAlreadyInGroup = groupObj.studentIDs.includes(studentId);

        !isAlreadyInGroup &&
          (await updateDoc(groupDoc, {
            studentIDs: [...groupObj.studentIDs, studentId],
          }));
      }
    });

    await Promise.all([
      ...groupPromises,
      await updateDoc(studentDoc, { groupIDs }),
    ]);
  }

  return (
    <ModalFrame isOpen={isOpen} toggleOpen={toggleOpen} title="학생 그룹 연결">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-fit flex-col"
      >
        <section aria-label="id-input" className="flex items-end gap-[12px]">
          <label
            htmlFor="id"
            className="h-[53px] w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]"
          >
            아이디(성명)
          </label>
          <div className="flex items-center gap-[10px] border-b border-[#777] pb-[5px]">
            <input
              id="id"
              type="email"
              readOnly
              placeholder="아이디는 이메일 형태, 영문/숫자 5자리 이상 입력"
              className="h-[34px] w-[260px] bg-[#fafafa] px-[5px] text-[14px] text-[#666] outline-none"
              value={`${accountId}(${name})`}
            />

            <button
              type="button"
              disabled={true}
              className="invisible h-[32px] w-[88px] border border-[#d9d9d9] bg-white text-[13px] text-[#777] disabled:cursor-not-allowed"
            ></button>
          </div>
        </section>
        <section aria-label="group-list" className="flex gap-[12px]">
          <label className="h-auto w-[150px] border-b border-[#ddd] pl-[12px] pt-[12px] text-[15px] text-[#333]">
            학생 그룹
          </label>
          <div className="flex flex-1 items-center gap-[10px] border-b border-[#777] pb-[5px]">
            {isLoading ? (
              "로딩중..."
            ) : (
              <ul className="grid w-full grid-cols-2 gap-3 py-3">
                {groups.map((group) => {
                  return (
                    <li key={group.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={group.id}
                        id={group.id}
                        defaultChecked={groupIDs.includes(group.id)}
                        {...register("checkbox")}
                      />
                      <label htmlFor={group.id}>{group.name}</label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
        <button
          type="submit"
          className="mx-auto mt-[30px] h-[36px] w-[82px] border border-[#007abe] bg-[#007abe] text-[13px] text-white"
        >
          {isSubmitLoading ? "저장중..." : "저장"}
        </button>
      </form>
    </ModalFrame>
  );
}
