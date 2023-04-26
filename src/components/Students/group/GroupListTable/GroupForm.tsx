import { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { isRefetchStudentGroupListState } from "../../../../stores/students";
import { STUDENT_GROUP_COLLECTION } from "../../../../api/collections";
import { addDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { IStudentGroup } from "../../../../api/models";
import dayjs from "dayjs";

function GroupForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setIsRefetch = useSetRecoilState(isRefetchStudentGroupListState);
  const [isLoading, setIsLoading] = useState(false);

  const resetField = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (inputRef.current) {
      const groupName = inputRef.current.value;

      if (!groupName) {
        alert("그룹명은 최소 한글자 이상 되어야 합니다.");
        resetField();
        setIsLoading(false);
        return;
      }

      try {
        const isDuplicate = await checkGroupNameDuplicate(groupName);

        if (isDuplicate) {
          alert("중복 되는 그룹명 입니다.");
        } else {
          await createStudentGroup(groupName);
          setIsRefetch(true);
          alert("그룹 생성 완료!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        resetField();
      }
    }
    setIsLoading(false);
  };

  return (
    <tr>
      <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        -
      </td>
      <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        <input
          ref={inputRef}
          placeholder="그룹명 입력"
          className="border border-[#555] text-center text-[16px] text-[#555]"
        />
      </td>
      <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        -
      </td>
      <td className="h-[50px] space-x-[5px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        <button
          onClick={handleSubmit}
          className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
        >
          {isLoading ? "등록중..." : "신규 등록"}
        </button>
      </td>
    </tr>
  );
}

export default GroupForm;

async function checkGroupNameDuplicate(groupName: string) {
  const q = query(STUDENT_GROUP_COLLECTION, where("name", "==", groupName));
  const snapShot = await getDocs(q);

  return !snapShot.empty;
}

async function createStudentGroup(groupName: string) {
  const data: IStudentGroup = {
    id: "",
    name: groupName,
    studentIDs: [],
    teacherIDs: [],
    teacherGroupIDs: [],
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
  };

  const newDoc = await addDoc(STUDENT_GROUP_COLLECTION, data);
  await updateDoc(newDoc, { id: newDoc.id });
}
