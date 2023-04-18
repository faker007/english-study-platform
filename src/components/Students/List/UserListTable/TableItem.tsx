import classNames from "classnames";
import GroupConnectButton from "./GroupConnectButton";
import UpdateStudentButton from "./UpdateStudentButton";

interface IProps {
  index: number;
  name: string;
  accountId: string;
  phoneNumber: string;
  recentLogin: string;
  isEnabled: boolean;
  lock: string;
  docId: string;
  groupIDs: string[];
}

export default function TableItem({
  accountId,
  index,
  name,
  phoneNumber,
  recentLogin,
  isEnabled,
  docId,
  groupIDs,
}: IProps) {
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
          {accountId}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {phoneNumber}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {recentLogin}
        </td>
        <td
          className={classNames(
            "h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]",
            {
              "!text-[red]": !isEnabled,
            }
          )}
        >
          {isEnabled ? "사용" : "정지"}
        </td>
        <td className="h-[50px] space-x-[5px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            대시보드
          </button>
          <UpdateStudentButton
            accountId={accountId}
            docId={docId}
            isEnabled={isEnabled}
            name={name}
            phoneNumber={phoneNumber}
          />
          <GroupConnectButton
            accountId={accountId}
            docId={docId}
            isEnabled={isEnabled}
            name={name}
            phoneNumber={phoneNumber}
            groupIDs={groupIDs}
          />
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            잠금해제
          </button>
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            삭제
          </button>
        </td>
      </tr>
    </>
  );
}
