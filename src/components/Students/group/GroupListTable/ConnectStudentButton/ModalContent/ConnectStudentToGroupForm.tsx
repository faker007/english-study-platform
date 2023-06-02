import { SubmitHandler, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import {
  isRefetchStudentGroupListState,
  isRefetchStudentListState,
} from "../../../../../../stores/students";
import { IStudentGroup } from "../../../../../../api/models";
import { useCallback, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../../../firebase";
import { COLLECTIONS } from "../../../../../../api/constants";
import useStudentList from "../../../../../../hooks/useStudentList";
import useStudentGroupList from "../../../../../../hooks/useStudentGroupList";
import { IFilterProps } from "../../../../../../types/Students";

interface IStudentSearchForm {
  groupID: string;
  query: string;
}

interface IStudentSelectForm {
  selectedStudentIDs: string[];
}

interface IProps {
  currentGroup: IStudentGroup;
}

function ConnectStudentToGroupForm({ currentGroup }: IProps) {
  // react-hook-form
  const {
    register: searchRegister,
    handleSubmit: searchHandleSubmit,
    resetField: searchResetField,
    watch: searchWatch,
  } = useForm<IStudentSearchForm>();
  const { register: selectRegister, handleSubmit: selectHandleSubmit } =
    useForm<IStudentSelectForm>();

  // state
  const [filterOptions, setFilterOptions] = useState<IFilterProps>({
    group: null,
    searchQuery: "",
    searchType: "ID",
  });

  // hooks
  const { students, isLoading: isStudentListLoading } =
    useStudentList(filterOptions);
  const { groups, isLoading: isStudentGroupLoading } = useStudentGroupList({});

  // recoil
  // const setFilterOptions = useSetRecoilState(filterPropsState);
  const setRefetchStudentGroupList = useSetRecoilState(
    isRefetchStudentGroupListState
  );
  const setRefetchStudentList = useSetRecoilState(isRefetchStudentListState);

  // derived variables
  const groupIDChanges = searchWatch("groupID");
  const outOfGroupStudents = students.filter(
    (student) => !currentGroup.studentIDs.includes(student.id)
  );
  const isLoading = isStudentListLoading || isStudentGroupLoading;

  // funcs
  const onSubmitSearchForm: SubmitHandler<IStudentSearchForm> = ({
    query,
    groupID,
  }) => {
    filterByGroupChange({ groupID, query });
  };

  const onSubmitSelectForm: SubmitHandler<IStudentSelectForm> = async ({
    selectedStudentIDs,
  }) => {
    try {
      // todo: 선택한 student Id를 이용해서 student쪽에는 groupIDs를 업데이트
      //  타겟 그룹에선 studentIDs를 업데이트해주면 됨.
      const groupDoc = doc(fbStore, COLLECTIONS.studentGroup, currentGroup.id);
      const studentIDs = Array.from(
        new Set([...currentGroup.studentIDs, ...selectedStudentIDs])
      );

      const studentUpdatePromises = selectedStudentIDs.map(
        async (studentID) => {
          const studentDoc = doc(fbStore, COLLECTIONS.student, studentID);
          const studentObj = outOfGroupStudents.find(
            (student) => student.id === studentID
          );

          if (studentObj) {
            const groupIDs = Array.from(
              new Set([...studentObj.groupIDs, currentGroup.id])
            );
            await updateDoc(studentDoc, { groupIDs });
          }

          return;
        }
      );

      await updateDoc(groupDoc, { studentIDs });
      await Promise.all(studentUpdatePromises);
      alert("성공적으로 업데이트 되었습니다.");
      setRefetchStudentGroupList(true);
      setRefetchStudentList(true);
    } catch (error) {
      console.error(error);
      alert("에러 발생");
    }
  };

  const filterByGroupChange = useCallback(
    ({ groupID, query }: IStudentSearchForm) => {
      const group = groups.find((group) => group.id === groupID) ?? null;

      setFilterOptions((prev) => {
        if (prev) return { ...prev, group, searchQuery: query };
        return { group, searchQuery: "", searchType: "ID" };
      });
    },
    [setFilterOptions, groups]
  );

  // effects
  useEffect(() => {
    if (typeof groupIDChanges !== "undefined") {
      filterByGroupChange({ groupID: groupIDChanges, query: "" });
      searchResetField("query");
    }
  }, [filterByGroupChange, groupIDChanges, searchResetField]);

  // render
  if (isLoading) {
    return <div className="flex-1 text-center">Loading...</div>;
  }

  return (
    <section className="flex flex-1 flex-col">
      <form
        onSubmit={searchHandleSubmit(onSubmitSearchForm)}
        className="flex w-full gap-3"
      >
        <select
          className="w-[110px] shrink-0 border border-slate-400 py-1 text-xs"
          {...searchRegister("groupID")}
        >
          <option value={""}>(그룹 미지정)</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="학생명/아이디 검색"
          className="w-full border border-slate-400 p-1 text-sm placeholder:text-slate-500"
          {...searchRegister("query")}
        />
      </form>
      <div className="mt-3 border-b border-black pb-3">
        <span className="text-sm font-medium text-slate-700">
          학생 검색 결과
        </span>
      </div>
      <form
        onSubmit={selectHandleSubmit(onSubmitSelectForm)}
        className="mt-2 flex flex-col"
      >
        <select
          className="h-[350px] w-full border border-black bg-zinc-100 text-sm outline-none"
          multiple
          {...selectRegister("selectedStudentIDs")}
        >
          {outOfGroupStudents.map((student) => (
            <option key={student.id} value={student.id} className="text-xs">
              {student.name} / {student.accountId} / {student.phoneNumber}
            </option>
          ))}
        </select>
        <button className="mt-3 self-center bg-sky-600 px-3 py-1.5 text-sm text-white">
          선택 학생 연결
        </button>
      </form>
    </section>
  );
}

export default ConnectStudentToGroupForm;
