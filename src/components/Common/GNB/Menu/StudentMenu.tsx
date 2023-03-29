import GNBLink from "../GNBLink";

export default function StudentMenu() {
  return (
    <div className="h-[60px] w-full bg-[#fafafa]">
      <ul className="mx-auto flex h-full w-full max-w-defualt-container items-center gap-[50px] pl-3">
        <li>
          <GNBLink text="시험 목록" url="#"></GNBLink>
        </li>
        <li>
          <GNBLink active text="제출한 시험" url="#"></GNBLink>
        </li>
        <li>
          <GNBLink text="Essay 목록" url="#"></GNBLink>
        </li>
        <li>
          <GNBLink text="제출한 Essay" url="#"></GNBLink>
        </li>
        <li>
          <GNBLink text="ACT Report" url="#"></GNBLink>
        </li>
        <li>
          <GNBLink text="SAT Report" url="#"></GNBLink>
        </li>
        <li>
          <GNBLink text="수업 자료실" url="#"></GNBLink>
        </li>
      </ul>
    </div>
  );
}
