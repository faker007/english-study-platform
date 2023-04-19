import classNames from "classnames";
import GroupConnectButton from "./GroupConnectButton";
import UpdateStudentButton from "./UpdateStudentButton";
import UnLockUserButton from "./UnLockUserButton";
import DeleteStudentButton from "./DeleteStudentButton";
import DashBoardButton from "./DashBoardButton";

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
          <DashBoardButton
            accountId={accountId}
            name={name}
            phoneNumber={phoneNumber}
          />
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
          <UnLockUserButton studentId={docId} accountId={accountId} />
          <DeleteStudentButton studentId={docId} groupIDs={groupIDs} />
        </td>
      </tr>
    </>
  );
}
