import TableItem from "./TableItem";
import Spinner from "../../../Common/Spinner";
import { IStudentGroup } from "../../../../api/models";
import { PAGE_PER } from "../../../../constants/Students";
import GroupForm from "./GroupForm";
import useUser from "../../../../hooks/useUser";
import { isAdmin } from "../../../../api/utils/teacher";

interface IProps {
  isLoading: boolean;
  groups: IStudentGroup[];
  page: number;
}

export default function GroupListTable({ isLoading, groups, page }: IProps) {
  const { user } = useUser();
  const currentPageGroups = groups.slice(
    PAGE_PER * page - PAGE_PER,
    PAGE_PER * page
  );

  return (
    <>
      <table className="mt-[10px] w-full table-fixed">
        <colgroup>
          <col className="w-[96px]"></col>
          <col className="w-[158px]"></col>
          <col className="w-[158px]"></col>
          <col className="w-auto"></col>
        </colgroup>
        <thead className="border-t-2 border-b border-t-[#333] border-b-[#999] text-[16px] text-[#333]">
          <tr>
            <th scope="col" className="bg-[#DCDCDC]">
              No.
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              그룹명
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              학생수
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              실행
            </th>
          </tr>
        </thead>
        <tbody className="relative">
          {isLoading ? (
            <div className="absolute top-0 left-0 flex w-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              {isAdmin(user) && <GroupForm />}
              {currentPageGroups.map((group, i) => (
                <TableItem key={group.id} index={i + 1} currentGroup={group} />
              ))}
            </>
          )}
        </tbody>
      </table>
      {!isLoading && (
        <div className="mt-[10px] w-full text-end text-[13px] text-[#888]">
          *count : {groups.length}
        </div>
      )}
    </>
  );
}
