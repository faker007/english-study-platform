function DisconnectStudentFromGroupForm() {
  return (
    <section className="flex flex-1 flex-col">
      <form>
        <input
          type="text"
          placeholder="그룹 학생명/아이디 검색"
          className="w-full border border-slate-400 p-1 text-sm"
        />
      </form>
      <div className="mt-3 border-b border-black pb-3">
        <span className="text-xs text-slate-700">
          <strong className="mr-1 text-base font-bold">기본그룹</strong>
          그룹 학생 리스트
        </span>
      </div>
      <form className="mt-2">
        <select
          className="h-[350px] w-full border border-black bg-zinc-100 text-sm outline-none"
          multiple
        >
          <option>a</option>
          <option>b</option>
          <option>c</option>
          <option>c</option>
          <option>c</option>
          <option>c</option>
          <option>c</option>
        </select>
      </form>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button className="bg-sky-600 px-3 py-1.5 text-sm text-white">
          선택 학생 해제
        </button>
        <button className="border border-black bg-white px-3 py-1.5 text-sm text-black">
          모든 학생 해제
        </button>
      </div>
    </section>
  );
}

export default DisconnectStudentFromGroupForm;
