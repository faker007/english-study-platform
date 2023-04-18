import { SubmitHandler, useForm } from "react-hook-form";
import useStudentList from "../../../../../../hooks/useStudentList";
import { useSetRecoilState } from "recoil";
import { filterPropsState } from "../../../../../../stores/students";
import useStudentGroupList from "../../../../../../hooks/useStudentGroupList";
import { IStudentGroup } from "../../../../../../api/models";

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
  const {
    register: searchRegister,
    handleSubmit: searchHandleSubmit,
    reset: searchReset,
  } = useForm<IStudentSearchForm>();
  const {
    register: selectRegister,
    handleSubmit: selectHandleSubmit,
    reset: selectReset,
  } = useForm<IStudentSelectForm>();

  const { students, isLoading: isStudentListLoading } = useStudentList();
  const { groups, isLoading: isStudentGroupLoading } = useStudentGroupList();
  const setFilterOptions = useSetRecoilState(filterPropsState);

  const onSubmitSearchForm: SubmitHandler<IStudentSearchForm> = ({
    query,
    groupID,
  }) => {
    console.log(groupID, query);
  };

  const onSubmitSelectForm: SubmitHandler<IStudentSelectForm> = ({
    selectedStudentIDs,
  }) => {
    console.log(selectedStudentIDs);
  };

  const isLoading = isStudentListLoading || isStudentGroupLoading;
  const outOfGroupStudents = students.filter(
    (student) => !currentGroup.studentIDs.includes(student.id)
  );

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
          <option value={"no-group"}>(그룹 미지정)</option>
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
            <option value={student.id} className="text-xs">
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
