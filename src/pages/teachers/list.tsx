import { useState } from "react";
import Pages from "../../components/Students/List/Pages";
import { MIN_PAGE } from "../../constants/Students";
import Filter from "../../components/Teachers/Filter";
import TeacherListTable from "../../components/Teachers/TeacherListTable";
import useTeacherList from "../../hooks/useTeacherList";
import useTeacherGroupList from "../../hooks/useTeacherGroupList";
import { ITeacherListFilter } from "../../types/Teachers";
import AdminControlPanel from "../../components/Teachers/AdminPanel";

export default function TeacherList() {
  const [page, setPage] = useState(MIN_PAGE);
  const [filter, setFilter] = useState<ITeacherListFilter>({
    group: null,
    searchQuery: "",
  });
  const {
    isLoading: isLoadingTeacherList,
    lastPage,
    teachers,
  } = useTeacherList(filter);
  const { isLoading: isLoadingTeacherGroupList, teacherGroups } =
    useTeacherGroupList({
      searchQuery: "",
    });

  const isLoading = isLoadingTeacherGroupList || isLoadingTeacherList;

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <h2 className="pt-[20px] text-[26px] font-bold text-[#111]">강사 계정</h2>
      <section className="mt-[20px] flex w-full items-center justify-center border border-[#e0e0e0] bg-[#f7f7f7] p-[20px]">
        <Filter
          setPage={setPage}
          setFilter={setFilter}
          groupList={teacherGroups}
        />
      </section>
      <section className="mt-[30px]">
        <div className="flex items-end justify-between">
          <span className="text-[12px] text-[brown]">
            ＃Tip: 강사별로 시험 관리 및 리포트 조회를 할 수 있도록 학생을
            연결해야 합니다.
          </span>

          <AdminControlPanel />
        </div>
        <TeacherListTable
          isLoading={isLoading}
          teachers={teachers}
          page={page}
        />
      </section>
      <section className="mt-[30px] mb-[60px] flex w-full items-center justify-center">
        {!isLoading && (
          <Pages page={page} lastPage={lastPage} setPage={setPage} />
        )}
      </section>
    </div>
  );
}
