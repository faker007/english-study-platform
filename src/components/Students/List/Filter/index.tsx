export default function Filter() {
  return (
    <form>
      <select className="mr-[10px] w-[120px] border border-[#eee] bg-white py-[6px] text-[14px] outline-none">
        <option>그룹 선택</option>
        <option>test001</option>
        <option>test002</option>
        <option>test003</option>
      </select>
      <select className="mr-[10px] w-[120px] border border-[#eee] bg-white py-[6px] text-[14px] outline-none">
        <option>아이디/성명</option>
        <option>연락처</option>
      </select>
      <input
        type="text"
        className="mr-[10px] h-[33px] w-[270px] border border-[#eee] bg-white py-[2px] px-[8px] text-[14px] leading-[33px] outline-none"
        placeholder="2~5글자 입력 후 Enter"
      />
      <button
        type="submit"
        className="mr-[10px] h-[33px] w-[80px] border border-[#444] bg-[#444] text-[13px] text-white"
      >
        검색
      </button>
      <button
        type="button"
        className="h-[33px] w-[80px] border border-[#757575] bg-white text-[13px] text-[#333]"
      >
        새로고침
      </button>
    </form>
  );
}
