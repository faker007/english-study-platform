import { useSetRecoilState } from "recoil";
import {
  isRefetchStudentGroupListState,
  isRefetchStudentListState,
} from "../../../../stores/students";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../firebase";
import { COLLECTIONS } from "../../../../api/constants";
import { IStudentGroup } from "../../../../api/models";

function DeleteStudentButton({
  studentId,
  groupIDs,
}: {
  studentId: string;
  groupIDs: string[];
}) {
  const setRefetchStudentList = useSetRecoilState(isRefetchStudentListState);
  const setRefetchStudentGroupList = useSetRecoilState(
    isRefetchStudentGroupListState
  );

  async function handleClickButton() {
    const isDeleteStudent = window.confirm(
      "학생과 연결된 모든 데이터가 삭제됩니다.\n학생을 삭제하시겠습니까?"
    );

    if (isDeleteStudent) {
      try {
        const studentDoc = doc(fbStore, COLLECTIONS.student, studentId);

        const groupPromises = groupIDs.map((groupId) =>
          updateGroupDoc(groupId, studentId)
        );

        await Promise.all(groupPromises);
        await deleteDoc(studentDoc);
        alert("성공적으로 삭제 되었습니다.");
        setRefetchStudentList(true);
        setRefetchStudentGroupList(true);
      } catch (error) {
        console.error(error);
        alert("에러가 발생하였습니다.");
      }
    }
  }

  return (
    <button
      onClick={handleClickButton}
      className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
    >
      삭제
    </button>
  );
}

export default DeleteStudentButton;

async function updateGroupDoc(groupId: string, currentStudentId: string) {
  const groupDoc = doc(fbStore, COLLECTIONS.studentGroup, groupId);
  const groupDocObj = await getDoc(groupDoc);

  if (groupDocObj.exists()) {
    const groupObj = groupDocObj.data() as IStudentGroup;
    const filteredStudentIDs = groupObj.studentIDs.filter(
      (studentId) => studentId !== currentStudentId
    );

    await updateDoc(groupDoc, { studentIDs: filteredStudentIDs });
  }
}
