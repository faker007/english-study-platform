import { useSetRecoilState } from "recoil";
import { IStudentGroup } from "../../../../api/models";
import { isRefetchStudentGroupListState } from "../../../../stores/students";
import { deleteDoc, doc } from "firebase/firestore";
import { fbStore } from "../../../../firebase";
import { COLLECTIONS } from "../../../../api/constants";

function DeleteGroupButton({ currentGroup }: { currentGroup: IStudentGroup }) {
  const setRefetchStudentGroupList = useSetRecoilState(
    isRefetchStudentGroupListState
  );

  const handleClickButton = async () => {
    if (currentGroup.studentIDs.length > 0)
      return alert("학생수가 0명 일때만 삭제할 수 있습니다.");

    const isDeleteOk = window.confirm(
      "그룹을 삭제하시겠습니까?\n그룹을 삭제해도 학생 정보는 삭제되지 않습니다."
    );

    if (isDeleteOk) {
      try {
        const groupDoc = doc(
          fbStore,
          COLLECTIONS.studentGroup,
          currentGroup.id
        );

        await deleteDoc(groupDoc);
        alert("성공적으로 삭제하였습니다.");
        setRefetchStudentGroupList(true);
      } catch (error) {
        console.error(error);
        alert("에러가 발생하였습니다.");
      }
    }
  };

  return (
    <button
      onClick={handleClickButton}
      className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
    >
      그룹 삭제
    </button>
  );
}

export default DeleteGroupButton;
