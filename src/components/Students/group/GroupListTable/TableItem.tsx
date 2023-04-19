import { IStudentGroup } from "../../../../api/models";
import ConnectStudentButton from "./ConnectStudentButton";
import ChangeGroupNameButton from "./ChangeGroupNameButton";
import DeleteGroupButton from "./DeleteGroupButton";

interface IProps {
  index: number;
  currentGroup: IStudentGroup;
}

export default function TableItem({ currentGroup, index }: IProps) {
  const { name, studentIDs } = currentGroup;

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
          {studentIDs.length}
        </td>
        <td className="h-[50px] space-x-[5px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          <ConnectStudentButton currentGroup={currentGroup} />
          <ChangeGroupNameButton currentGroup={currentGroup} />
          <DeleteGroupButton currentGroup={currentGroup} />
        </td>
      </tr>
    </>
  );
}
