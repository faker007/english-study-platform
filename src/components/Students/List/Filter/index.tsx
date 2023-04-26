import { SubmitHandler, useForm } from "react-hook-form";
import { IFilterForm, IFilterProps } from "../../../../types/Students";
import { FILTER_SEARCH_TYPES, MIN_PAGE } from "../../../../constants/Students";
import { IStudentGroup } from "../../../../api/models";
import { useEffect } from "react";

interface IProps {
  groupList: IStudentGroup[];
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterProps>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Filter({
  groupList,
  setFilterOptions,
  setPage,
}: IProps) {
  const { register, handleSubmit, reset, watch } = useForm<IFilterForm>();

  const groupWatchValue = watch("group");

  const onSubmit: SubmitHandler<IFilterForm> = ({
    group,
    searchQuery,
    searchType,
  }) => {
    setFilterOptions({
      searchQuery,
      searchType,
      group: groupList.find((item) => item.id === group) ?? null,
    });
    setPage(MIN_PAGE);
  };

  const handleResetForm = () => {
    reset();
    setFilterOptions({ group: null, searchQuery: "", searchType: "ID" });
  };

  useEffect(() => {
    const handleChangeGroup = () => {
      if (typeof groupWatchValue !== "undefined") {
        setFilterOptions((prev) => ({
          ...prev,
          group: groupList.find((item) => item.id === groupWatchValue) ?? null,
        }));
        setPage(MIN_PAGE);
      }
    };

    handleChangeGroup();
  }, [setFilterOptions, setPage, groupList, groupWatchValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select
        className="mr-[10px] w-[120px] border border-[#eee] bg-white py-[6px] text-[14px] outline-none"
        {...register("group")}
      >
        <option value={""}>그룹 선택</option>
        {groupList.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <select
        className="mr-[10px] w-[120px] border border-[#eee] bg-white py-[6px] text-[14px] outline-none"
        {...register("searchType")}
      >
        <option value={FILTER_SEARCH_TYPES.ID}>아이디/성명</option>
        <option value={FILTER_SEARCH_TYPES.PHONE}>연락처</option>
      </select>
      <input
        type="text"
        className="mr-[10px] h-[33px] w-[270px] border border-[#eee] bg-white py-[2px] px-[8px] text-[14px] leading-[33px] outline-none"
        placeholder="2~5글자 입력 후 Enter"
        {...register("searchQuery")}
      />
      <button
        type="submit"
        className="mr-[10px] h-[33px] w-[80px] border border-[#444] bg-[#444] text-[13px] text-white"
      >
        검색
      </button>
      <button
        onClick={handleResetForm}
        type="button"
        className="h-[33px] w-[80px] border border-[#757575] bg-white text-[13px] text-[#333]"
      >
        새로고침
      </button>
    </form>
  );
}
