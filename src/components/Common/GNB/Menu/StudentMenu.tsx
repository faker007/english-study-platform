import GNBLink from "../Link/gnb";

export default function StudentMenu() {
  return (
    <div className="h-[60px] w-full bg-[#fafafa]">
      <ul className="mx-auto flex h-full w-full max-w-defualt-container items-center gap-[50px] pl-3">
        <li>
          <GNBLink text="시험 목록" url="#" />
        </li>
        <li>
          <GNBLink active text="제출한 시험" url="#" />
        </li>
        <li>
          <GNBLink text="Essay 목록" url="#" />
        </li>
        <li>
          <GNBLink text="제출한 Essay" url="#" />
        </li>
        <li>
          <GNBLink text="ACT Report" url="#" />
        </li>
        <li>
          <GNBLink text="SAT Report" url="#" />
        </li>
        <li>
          <GNBLink text="수업 자료실" url="#" />
        </li>
      </ul>
    </div>
  );
}
