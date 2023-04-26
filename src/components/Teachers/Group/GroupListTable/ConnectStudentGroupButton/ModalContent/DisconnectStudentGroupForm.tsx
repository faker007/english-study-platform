import { SubmitHandler, useForm } from "react-hook-form";
import { ITeacherGroup } from "../../../../../../api/models";
import { doc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../../../firebase";
import { COLLECTIONS } from "../../../../../../api/constants";
import { useSetRecoilState } from "recoil";
import { isRefetchStudentGroupListState } from "../../../../../../stores/students";
import { isRefetchTeacherGroupListState } from "../../../../../../stores/teachers";
import useStudentGroupList from "../../../../../../hooks/useStudentGroupList";

interface IStudentSelectForm {
  selectedStudentGroupIds: string[];
}

interface IProps {
  currentGroup: ITeacherGroup;
}

function DisconnectStudentGroupForm({ currentGroup }: IProps) {
  const {
    register: registerStudentSelectForm,
    handleSubmit: handleSubmitStudentSelectForm,
  } = useForm<IStudentSelectForm>();

  // recoil
  const setRefetchStudentGroupList = useSetRecoilState(
    isRefetchStudentGroupListState
  );
  const setRefetchTeacherGroupList = useSetRecoilState(
    isRefetchTeacherGroupListState
  );

  //   hooks
  const { groups: studentGroups, isLoading: isLoadingStudentGroups } =
    useStudentGroupList({});

  // derived vars
  const currentStudentGroups = studentGroups.filter((studentGroup) =>
    currentGroup.studentGroupIDs.includes(studentGroup.id)
  );

  // funcs
  const onSubmitStudentSelectForm: SubmitHandler<IStudentSelectForm> = async ({
    selectedStudentGroupIds,
  }) => {
    // todo
    // 1. 기본 동작은 그룹에서 선택한 학생그룹들을 방출하는 기능을 해야함.
    // 2. 선생님 그룹쪽에선 학생 그룹 아이디 리스트에서 선택 된 학생 그룹 아이디를 제거해줘야함.
    // 3. 학생 그룹 쪽에선 currentGroup의 id를 teacherGroupIDs에서 제거해줘야 함.

    try {
      const groupDoc = doc(fbStore, COLLECTIONS.teacherGroup, currentGroup.id);
      const extractedStudentGroupIDs = currentGroup.studentGroupIDs.filter(
        (studentGroupId) => !selectedStudentGroupIds.includes(studentGroupId)
      );

      const studentGroupPromises = selectedStudentGroupIds.map(
        (studentGroupId) => updateStudentGroupDoc(studentGroupId, currentGroup)
      );

      await updateDoc(groupDoc, { studentGroupIDs: extractedStudentGroupIDs });
      await Promise.all(studentGroupPromises);
      setRefetchStudentGroupList(true);
      setRefetchTeacherGroupList(true);
      alert("성공적으로 업데이트 되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  async function updateStudentGroupDoc(
    studentGroupId: string,
    currentGroup: ITeacherGroup
  ) {
    const studentGroupDoc = doc(
      fbStore,
      COLLECTIONS.studentGroup,
      studentGroupId
    );
    const studentGroupObj = studentGroups.find(
      (studentGroup) => studentGroup.id === studentGroupId
    );

    if (studentGroupObj) {
      const extractedTeacherGroupIDs = studentGroupObj.teacherGroupIDs.filter(
        (teacherGroupId) => teacherGroupId !== currentGroup.id
      );
      await updateDoc(studentGroupDoc, {
        teacherGroupIDs: extractedTeacherGroupIDs,
      });
    }
  }

  //   render
  if (isLoadingStudentGroups) {
    return (
      <div className="flex-1 text-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <section className="flex flex-1 flex-col">
      <div className="mt-3 border-b border-black pb-3">
        <span className="text-xs text-slate-700">
          <strong className="mr-1 text-base font-bold">
            {currentGroup.name}
          </strong>
          와 연결된 학생 그룹
        </span>
      </div>
      <form
        onSubmit={handleSubmitStudentSelectForm(onSubmitStudentSelectForm)}
        className="mt-2"
      >
        <select
          className="h-[350px] w-full border border-black bg-zinc-100 text-sm outline-none"
          multiple
          {...registerStudentSelectForm("selectedStudentGroupIds")}
        >
          {currentStudentGroups.map((studentGroup) => (
            <option
              key={studentGroup.id}
              value={studentGroup.id}
              className="text-xs"
            >
              {studentGroup.name}
            </option>
          ))}
        </select>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="submit"
            className="bg-sky-600 px-3 py-1.5 text-sm text-white"
          >
            선택 학생 해제
          </button>
          <button
            type="button"
            onClick={() =>
              onSubmitStudentSelectForm({
                selectedStudentGroupIds: currentGroup.studentGroupIDs,
              })
            }
            className="border border-black bg-white px-3 py-1.5 text-sm text-black"
          >
            모든 학생 해제
          </button>
        </div>
      </form>
    </section>
  );
}

export default DisconnectStudentGroupForm;
