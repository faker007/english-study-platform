import { IStudentGroup } from "../../../../api/models";
import ConnectStudentButton from "./ConnectStudentButton";

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
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            그룹명 변경
          </button>
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            그룹 삭제
          </button>
        </td>
      </tr>
    </>
  );
}
