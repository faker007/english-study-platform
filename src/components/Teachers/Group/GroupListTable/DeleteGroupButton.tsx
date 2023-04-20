import { useSetRecoilState } from "recoil";
import { IStudentGroup, ITeacher, ITeacherGroup } from "../../../../api/models";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../firebase";
import { COLLECTIONS } from "../../../../api/constants";
import { isRefetchTeacherGroupListState } from "../../../../stores/teachers";

interface IProps {
  currentGroup: ITeacherGroup;
}

function DeleteGroupButton({ currentGroup }: IProps) {
  const setRefetchTeacherGroupList = useSetRecoilState(
    isRefetchTeacherGroupListState
  );

  async function deleteCurrentTeacherGroup() {
    const groupDoc = doc(fbStore, COLLECTIONS.teacherGroup, currentGroup.id);

    await deleteDoc(groupDoc);
  }

  async function disconnectTeachersFromCurrentGroup(teacherIds: string[]) {
    const promises = teacherIds.map(async (teacherId) => {
      const teacherDoc = doc(fbStore, COLLECTIONS.teacher, teacherId);
      const teacherObj = await getDoc(teacherDoc);

      if (teacherObj.exists()) {
        const teacherData = teacherObj.data() as ITeacher;
        const groupIDs = teacherData.groupIDs.filter(
          (groupId) => groupId !== currentGroup.id
        );

        await updateDoc(teacherDoc, { groupIDs });
      }

      await Promise.all(promises);
    });
  }

  async function disconnectStudentGroupsFromCurrentGroup(
    studentGroupIds: string[]
  ) {
    const promises = studentGroupIds.map(async (studentGroupId) => {
      const studentGroupDoc = doc(
        fbStore,
        COLLECTIONS.studentGroup,
        studentGroupId
      );
      const studentGroupObj = await getDoc(studentGroupDoc);

      if (studentGroupObj.exists()) {
        const studentGroupData = studentGroupObj.data() as IStudentGroup;
        const teacherGroupIDs = studentGroupData.teacherGroupIDs.filter(
          (groupId) => groupId !== currentGroup.id
        );

        await updateDoc(studentGroupDoc, { teacherGroupIDs });
      }

      await Promise.all(promises);
    });
  }

  const handleClickButton = async () => {
    if (currentGroup.teacherIDs.length > 0)
      return alert("강사수가 0명 일때만 삭제할 수 있습니다.");

    const isDeleteOk = window.confirm(
      "그룹을 삭제하시겠습니까?\n그룹을 삭제해도 강사 정보는 삭제되지 않습니다."
    );

    if (isDeleteOk) {
      try {
        if (currentGroup.teacherIDs.length > 0) {
          await disconnectTeachersFromCurrentGroup(currentGroup.teacherIDs);
        }

        if (currentGroup.studentGroupIDs.length > 0) {
          await disconnectStudentGroupsFromCurrentGroup(
            currentGroup.studentGroupIDs
          );
        }

        await deleteCurrentTeacherGroup();
        alert("성공적으로 삭제하였습니다.");
        setRefetchTeacherGroupList(true);
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
