import { SubmitHandler, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { isRefetchStudentGroupListState } from "../../../../../../stores/students";
import { ITeacherGroup } from "../../../../../../api/models";
import { doc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../../../firebase";
import { COLLECTIONS } from "../../../../../../api/constants";
import useStudentGroupList from "../../../../../../hooks/useStudentGroupList";
import { isRefetchTeacherGroupListState } from "../../../../../../stores/teachers";

interface IStudentSelectForm {
  selectedStudentGroupIds: string[];
}

interface IProps {
  currentGroup: ITeacherGroup;
}

export default function ConnectStudentGroupForm({ currentGroup }: IProps) {
  // react-hook-form
  const { register: selectRegister, handleSubmit: selectHandleSubmit } =
    useForm<IStudentSelectForm>();

  // hooks
  const { groups: studentGroups, isLoading: isStudentGroupLoading } =
    useStudentGroupList({});

  // recoil
  const setRefetchStudentGroupList = useSetRecoilState(
    isRefetchStudentGroupListState
  );
  const setRefetchTeacherGroupList = useSetRecoilState(
    isRefetchTeacherGroupListState
  );

  // derived variables
  const isLoading = isStudentGroupLoading;
  const excludedStudentGroups = studentGroups.filter(
    (studentGroup) => !currentGroup.studentGroupIDs.includes(studentGroup.id)
  );

  // funcs
  const onSubmitSelectForm: SubmitHandler<IStudentSelectForm> = async ({
    selectedStudentGroupIds,
  }) => {
    try {
      // todo: 선택한 student Id를 이용해서 student쪽에는 groupIDs를 업데이트
      //  타겟 그룹에선 studentIDs를 업데이트해주면 됨.
      const groupDoc = doc(fbStore, COLLECTIONS.teacherGroup, currentGroup.id);
      const studentGroupIDs = Array.from(
        new Set([...currentGroup.studentGroupIDs, ...selectedStudentGroupIds])
      );

      const studentGroupPromises = selectedStudentGroupIds.map(
        async (studentGroupId) => {
          const studentGroupDoc = doc(
            fbStore,
            COLLECTIONS.studentGroup,
            studentGroupId
          );
          const studentGroupObj = studentGroups.find(
            (group) => group.id === studentGroupId
          );

          if (studentGroupObj) {
            const teacherGroupIDs = Array.from(
              new Set([...studentGroupObj.teacherGroupIDs, currentGroup.id])
            );
            await updateDoc(studentGroupDoc, { teacherGroupIDs });
          }
        }
      );

      await updateDoc(groupDoc, { studentGroupIDs });
      await Promise.all(studentGroupPromises);
      alert("성공적으로 업데이트 되었습니다.");
      setRefetchStudentGroupList(true);
      setRefetchTeacherGroupList(true);
    } catch (error) {
      console.error(error);
      alert("에러 발생");
    }
  };

  // render
  if (isLoading) {
    return <div className="flex-1 text-center">Loading...</div>;
  }

  return (
    <section className="flex flex-1 flex-col">
      <div className="mt-3 border-b border-black pb-3">
        <span className="text-sm font-medium text-slate-700">
          모든 학생 그룹
        </span>
      </div>
      <form
        onSubmit={selectHandleSubmit(onSubmitSelectForm)}
        className="mt-2 flex flex-col"
      >
        <select
          className="h-[350px] w-full border border-black bg-zinc-100 text-sm outline-none"
          multiple
          {...selectRegister("selectedStudentGroupIds")}
        >
          {excludedStudentGroups.map((group) => (
            <option key={group.id} value={group.id} className="text-xs">
              {group.name}
            </option>
          ))}
        </select>
        <button className="mt-3 self-center bg-sky-600 px-3 py-1.5 text-sm text-white">
          선택 그룹 연결
        </button>
      </form>
    </section>
  );
}
