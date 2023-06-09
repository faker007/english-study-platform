import { useState } from "react";
import Filter from "../../components/Students/List/Filter";
import Pages from "../../components/Students/List/Pages";
import UserListTable from "../../components/Students/List/UserListTable";
import useStudentList from "../../hooks/useStudentList";
import { MIN_PAGE } from "../../constants/Students";
import AdminControlPanel from "../../components/Students/List/AdminControlPanel";
import { IFilterProps } from "../../types/Students";
import useStudentGroupList from "../../hooks/useStudentGroupList";
import useUser from "../../hooks/useUser";
import { isAdmin } from "../../api/utils/teacher";

export default function StudentList() {
  const { user } = useUser();
  const [page, setPage] = useState(MIN_PAGE);
  const [filterOptions, setFilterOptions] = useState<IFilterProps>({
    group: null,
    searchQuery: "",
    searchType: "ID",
  });
  const {
    isLoading: isLoadingStudentList,
    students,
    lastPage,
  } = useStudentList(filterOptions);
  const { isLoading: isLoadingStudentGroupList, groups } = useStudentGroupList(
    {}
  );

  const isLoading = isLoadingStudentGroupList || isLoadingStudentList;

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <h2 className="pt-[20px] text-[26px] font-bold text-[#111]">학생 정보</h2>
      <section className="mt-[20px] flex w-full items-center justify-center border border-[#e0e0e0] bg-[#f7f7f7] p-[20px]">
        <Filter
          setPage={setPage}
          setFilterOptions={setFilterOptions}
          groupList={groups}
        />
      </section>
      <section className="mt-[30px]">
        <div className="flex items-end justify-between">
          <span className="text-[12px] text-[brown]">
            ＃Tip: 비밀번호 분실이나 기간 만료로 로그인이 안될 경우 잠금 해제를
            하면 됩니다.
          </span>

          {isAdmin(user) && <AdminControlPanel />}
        </div>
        <UserListTable isLoading={isLoading} students={students} page={page} />
      </section>
      <section className="mt-[30px] mb-[60px] flex w-full items-center justify-center">
        {!isLoading && (
          <Pages page={page} lastPage={lastPage} setPage={setPage} />
        )}
      </section>
    </div>
  );
}
