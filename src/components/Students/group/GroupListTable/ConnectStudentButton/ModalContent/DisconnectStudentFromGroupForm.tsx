import { SubmitHandler, useForm } from "react-hook-form";
import { IStudent, IStudentGroup } from "../../../../../../api/models";

interface IStudentSearchForm {
  query: string;
}

interface IStudentSelectForm {
  selectedStudentIDs: string[];
}

interface IProps {
  currentGroup: IStudentGroup;
  students: IStudent[];
  groups: IStudentGroup[];
  isStudentListLoading: boolean;
  isStudentGroupLoading: boolean;
}

function DisconnectStudentFromGroupForm({
  currentGroup,
  groups,
  isStudentGroupLoading,
  isStudentListLoading,
  students,
}: IProps) {
  const {
    register: registerStudentSearchForm,
    handleSubmit: handleSubmitStudentSearchForm,
  } = useForm<IStudentSearchForm>();
  const {
    register: registerStudentSelectForm,
    handleSubmit: handleSubmitStudentSelectForm,
  } = useForm<IStudentSelectForm>();

  const onSubmitStudentSearchForm: SubmitHandler<IStudentSearchForm> = ({
    query,
  }) => {
    console.log(query);
  };

  const onSubmitStudentSelectForm: SubmitHandler<IStudentSelectForm> = ({
    selectedStudentIDs,
  }) => {
    console.log(selectedStudentIDs);
  };

  const groupStudents = students.filter((student) =>
    currentGroup.studentIDs.includes(student.id)
  );

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
