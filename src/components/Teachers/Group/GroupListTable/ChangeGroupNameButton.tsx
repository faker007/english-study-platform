import { useSetRecoilState } from "recoil";
import { ITeacherGroup } from "../../../../api/models";
import { doc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../firebase";
import { COLLECTIONS } from "../../../../api/constants";
import { isRefetchTeacherGroupListState } from "../../../../stores/teachers";

function ChangeGroupNameButton({
  currentGroup,
}: {
  currentGroup: ITeacherGroup;
}) {
  const setRefetchTeacherGroupList = useSetRecoilState(
    isRefetchTeacherGroupListState
  );

  const handleClickButton = async () => {
    const willChangeGroupName = prompt(
      "변경할 그룹명을 입력해 주세요.",
      currentGroup.name
    );
    if (!willChangeGroupName) return;

    const groupDoc = doc(fbStore, COLLECTIONS.teacherGroup, currentGroup.id);

    try {
      await updateDoc(groupDoc, { name: willChangeGroupName });
      setRefetchTeacherGroupList(true);
      alert("성공적으로 변경 되었습니다.");
    } catch (error) {
      console.error(error);
      alert("오류가 발생하였습니다.");
    }
  };

  return (
    <button
      onClick={handleClickButton}
      className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
    >
      그룹명 변경
    </button>
  );
}

export default ChangeGroupNameButton;
