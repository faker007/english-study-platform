import { ITeacherGroup } from "../../../../api/models";
import ChangeGroupNameButton from "./ChangeGroupNameButton";
import ConnectStudentGroupButton from "./ConnectStudentGroupButton";
import DeleteGroupButton from "./DeleteGroupButton";

interface IProps {
  index: number;
  currentGroup: ITeacherGroup;
}

export default function TableItem({ currentGroup, index }: IProps) {
  const { name, teacherIDs } = currentGroup;

  return (
    <>
      <tr>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {index}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {name}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {teacherIDs.length}
        </td>
        <td className="h-[50px] space-x-[5px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          <ConnectStudentGroupButton currentGroup={currentGroup} />
          <ChangeGroupNameButton currentGroup={currentGroup} />
          <DeleteGroupButton currentGroup={currentGroup} />
        </td>
      </tr>
    </>
  );
}
