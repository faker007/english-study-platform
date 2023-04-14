import { SubmitHandler, useForm } from "react-hook-form";
import { IFilterForm } from "../../../../types/Students";
import { FILTER_SEARCH_TYPES } from "../../../../constants/Students";
import { useSetRecoilState } from "recoil";
import { filterPropsState } from "../../../../stores/students";
import { IStudentGroup } from "../../../../api/models";

interface IProps {
  groupList: IStudentGroup[];
}

export default function Filter({ groupList }: IProps) {
  const { register, handleSubmit, reset } = useForm<IFilterForm>();
  const setFilterOption = useSetRecoilState(filterPropsState);

  const onSubmit: SubmitHandler<IFilterForm> = ({
    group,
    searchQuery,
    searchType,
  }) =>
    setFilterOption({
      searchQuery,
      searchType,
      group: groupList.find((item) => item.name === group) ?? null,
    });

  const handleResetForm = () => reset();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select
        className="mr-[10px] w-[120px] border border-[#eee] bg-white py-[6px] text-[14px] outline-none"
        {...register("group")}
      >
        <option value={""}>그룹 선택</option>
        {groupList.map((group) => (
          <option key={group.id} value={group.name}>
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
