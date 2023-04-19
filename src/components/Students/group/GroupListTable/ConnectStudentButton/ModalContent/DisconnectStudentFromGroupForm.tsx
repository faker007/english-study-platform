import { SubmitHandler, useForm } from "react-hook-form";
import { IStudentGroup } from "../../../../../../api/models";
import { useState } from "react";
import { IFilterProps } from "../../../../../../types/Students";
import useStudentList from "../../../../../../hooks/useStudentList";
import { doc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../../../firebase";
import { COLLECTIONS } from "../../../../../../api/constants";
import { useSetRecoilState } from "recoil";
import {
  isRefetchStudentGroupListState,
  isRefetchStudentListState,
} from "../../../../../../stores/students";

interface IStudentSearchForm {
  query: string;
}

interface IStudentSelectForm {
  selectedStudentIDs: string[];
}

interface IProps {
  currentGroup: IStudentGroup;
}

function DisconnectStudentFromGroupForm({ currentGroup }: IProps) {
  const {
    register: registerStudentSearchForm,
    handleSubmit: handleSubmitStudentSearchForm,
  } = useForm<IStudentSearchForm>();
  const {
    register: registerStudentSelectForm,
    handleSubmit: handleSubmitStudentSelectForm,
  } = useForm<IStudentSelectForm>();

  // state
  const [filterOptions, setFilterOptions] = useState<IFilterProps>({
    group: null,
    searchQuery: "",
    searchType: "ID",
  });

  // hooks
  const { students, isLoading: isStudentListLoading } =
    useStudentList(filterOptions);

  // recoil
  const setRefetchStudentGroupList = useSetRecoilState(
    isRefetchStudentGroupListState
  );
  const setRefetchStudentList = useSetRecoilState(isRefetchStudentListState);

  // derived variables
  const groupStudents = students.filter((student) =>
    currentGroup.studentIDs.includes(student.id)
  );

  // funcs
  const onSubmitStudentSearchForm: SubmitHandler<IStudentSearchForm> = ({
    query,
  }) => {
    setFilterOptions({ group: null, searchQuery: query, searchType: "ID" });
  };

  const onSubmitStudentSelectForm: SubmitHandler<IStudentSelectForm> = async ({
    selectedStudentIDs,
  }) => {
    // todo
    // 1. 기본 동작은 그룹에서 선택한 학생들을 방출하는 기능을 해야함.
    // 2. 그러기 위해선 학생쪽에선 groupIDs에 currentGroup의 id를 제거해야함.
    // 3. 그룹쪽에선 studentIDs에 selectedStudentIDs에 있는 id들을 제거해줘야 함.

    try {
      const groupDoc = doc(fbStore, COLLECTIONS.studentGroup, currentGroup.id);
      const extractedStudentIDs = currentGroup.studentIDs.filter(
        (studentId) => !selectedStudentIDs.includes(studentId)
      );

      const studentPromises = selectedStudentIDs.map((studentId) =>
        updateStudentDoc(studentId, currentGroup)
      );

      await updateDoc(groupDoc, { studentIDs: extractedStudentIDs });
      await Promise.all(studentPromises);
      setRefetchStudentGroupList(true);
      setRefetchStudentList(true);
      alert("성공적으로 업데이트 되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  async function updateStudentDoc(
    studentId: string,
    currentGroup: IStudentGroup
  ) {
    const studentDoc = doc(fbStore, COLLECTIONS.student, studentId);
    const studentObj = groupStudents.find(
      (student) => student.id === studentId
    );

    if (studentObj) {
      const extractedGroupIDs = studentObj.groupIDs.filter(
        (groupId) => groupId !== currentGroup.id
      );
      await updateDoc(studentDoc, { groupIDs: extractedGroupIDs });
    }
  }

  if (isStudentListLoading) {
    return (
      <div className="flex-1 text-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <section className="flex flex-1 flex-col">
      <form onSubmit={handleSubmitStudentSearchForm(onSubmitStudentSearchForm)}>
        <input
          type="text"
          placeholder="그룹 학생명/아이디 검색"
          className="w-full border border-slate-400 p-1 text-sm"
          {...registerStudentSearchForm("query")}
        />
      </form>
      <div className="mt-3 border-b border-black pb-3">
        <span className="text-xs text-slate-700">
          <strong className="mr-1 text-base font-bold">
            {currentGroup.name}
          </strong>
          그룹 학생 리스트
        </span>
      </div>
      <form
        onSubmit={handleSubmitStudentSelectForm(onSubmitStudentSelectForm)}
        className="mt-2"
      >
        <select
          className="h-[350px] w-full border border-black bg-zinc-100 text-sm outline-none"
          multiple
          {...registerStudentSelectForm("selectedStudentIDs")}
        >
          {groupStudents.map((student) => (
            <option key={student.id} value={student.id} className="text-xs">
              {student.name} / {student.accountId} / {student.phoneNumber}
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
                selectedStudentIDs: groupStudents.map((student) => student.id),
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

export default DisconnectStudentFromGroupForm;
