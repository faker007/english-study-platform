import TableItem from "./TableItem";
import dayjs from "dayjs";
import Spinner from "../../../Common/Spinner";
import { IUser } from "../../../../api/models";
import { PAGE_PER } from "../../../../constants/Students";

interface IProps {
  isLoading: boolean;
  students: IUser[];
  page: number;
}

export default function UserListTable({ isLoading, students, page }: IProps) {
  const currentPageStudents = students.slice(
    PAGE_PER * page - PAGE_PER,
    PAGE_PER * page
  );

  return (
    <>
      <table className="mt-[10px] w-full table-fixed">
        <colgroup>
          <col className="w-[60px]"></col>
          <col className="w-[120px]"></col>
          <col className="w-[120px]"></col>
          <col className="w-[120px]"></col>
          <col className="w-[130px]"></col>
          <col className="w-[60px]"></col>
          <col className="w-auto"></col>
        </colgroup>
        <thead className="border-t-2 border-b border-t-[#333] border-b-[#999] text-[16px] text-[#333]">
          <tr>
            <th scope="col" className="bg-[#DCDCDC]">
              No.
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              성명
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              아이디
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              연락처
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              최근로그인
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              사용
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
            currentPageStudents.map((student, i) => (
              <TableItem
                key={student.id}
                accountId={student.accountId}
                docId={student.id}
                index={i + 1}
                lock="lock"
                name={student.name}
                phoneNumber={student.phoneNumber}
                groupIDs={student.groupIDs}
                recentLogin={
                  student.lastLoginTime
                    ? dayjs(student.lastLoginTime).format("YYYY-MM-DD HH:mm")
                    : ""
                }
                isEnabled={student.isEnabled}
              />
            ))
          )}
        </tbody>
      </table>
      {!isLoading && (
        <div className="mt-[10px] w-full text-end text-[13px] text-[#888]">
          *count : {students.length}
        </div>
      )}
    </>
  );
}
