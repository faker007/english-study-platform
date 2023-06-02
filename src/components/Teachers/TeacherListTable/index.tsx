import { PAGE_PER } from "../../../constants/Students";
import { ITeacher } from "../../../api/models";
import Spinner from "../../Common/Spinner";
import TableItem from "./TableItem";

interface IProps {
  isLoading: boolean;
  teachers: ITeacher[];
  page: number;
}

export default function TeacherListTable({
  isLoading,
  teachers,
  page,
}: IProps) {
  const currentPageTeachers = teachers.slice(
    PAGE_PER * page - PAGE_PER,
    PAGE_PER * page
  );

  return (
    <>
      <table className="mt-[10px] w-full table-fixed">
        <colgroup>
          <col className="w-[60px]"></col>
          <col className="w-[94px]"></col>
          <col className="w-[94px]"></col>
          <col className="w-[124px]"></col>
          <col className="w-[138px]"></col>
          <col className="w-[148px]"></col>
          <col className="w-[70px]"></col>
          <col className="w-auto"></col>
        </colgroup>
        <thead className="border-t-2 border-b border-t-[#333] border-b-[#999] text-[16px] text-[#333]">
          <tr>
            <th scope="col" className="bg-[#DCDCDC]">
              No.
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              강사 그룹
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
              최근 로그인
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
            currentPageTeachers.map((teacher, i) => (
              <TableItem key={teacher.id} index={i} teacher={teacher} />
            ))
          )}
        </tbody>
      </table>
      {!isLoading && (
        <div className="mt-[10px] w-full text-end text-[13px] text-[#888]">
          *count : {teachers.length}
        </div>
      )}
    </>
  );
}
