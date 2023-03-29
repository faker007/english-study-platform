import { useState } from "react";
import {
  STUDENT_MANAGE_LNB_ITEMS,
  ESSAY_MANAGE_LNB_ITEMS,
  PROBLEM_BANK_LNB_ITEMS,
  REFERENCE_LNB_ITEMS,
  TEST_MANAGE_LNB_ITEMS,
} from "../../../../constants/GNB";
import { TeacherMenuItems } from "../../../../types/GNB";
import GNBLink from "../GNBLink";
import LNBList from "../LNBList";

export default function TeacherMenu() {
  const [activeMenu, setActiveMenu] = useState<TeacherMenuItems>();

  function handleActiveMenu(menu: TeacherMenuItems) {
    setActiveMenu(menu);
  }

  return (
    <div>
      <section className="h-[60px] w-full bg-[#fafafa]">
        <ul className="mx-auto flex h-full w-full max-w-defualt-container items-center gap-[50px] pl-3">
          <li
            onMouseEnter={() => handleActiveMenu("STUDENT_MANAGE")}
            className="relative h-full"
          >
            <GNBLink text="학생 관리" url="#"></GNBLink>
            {activeMenu === "STUDENT_MANAGE" && (
              <LNBList data={STUDENT_MANAGE_LNB_ITEMS} />
            )}
          </li>
          <li
            onMouseEnter={() => handleActiveMenu("PROBLEM_BANK")}
            className="relative h-full"
          >
            <GNBLink text="문제 은행" active url="#"></GNBLink>
            {activeMenu === "PROBLEM_BANK" && (
              <LNBList data={PROBLEM_BANK_LNB_ITEMS} />
            )}
          </li>
          <li
            onMouseEnter={() => handleActiveMenu("TEST_MANAGE")}
            className="relative h-full"
          >
            <GNBLink text="시험 관리" url="#"></GNBLink>
            {activeMenu === "TEST_MANAGE" && (
              <LNBList data={TEST_MANAGE_LNB_ITEMS} />
            )}
          </li>
          <li
            onMouseEnter={() => handleActiveMenu("ESSAY_MANAGE")}
            className="relative h-full"
          >
            <GNBLink text="Essay 관리" url="#"></GNBLink>
            {activeMenu === "ESSAY_MANAGE" && (
              <LNBList data={ESSAY_MANAGE_LNB_ITEMS} />
            )}
          </li>
          <li
            onMouseEnter={() => handleActiveMenu("REFERENCE")}
            className="relative h-full"
          >
            <GNBLink text="자료실" url="#"></GNBLink>
            {activeMenu === "REFERENCE" && (
              <LNBList data={REFERENCE_LNB_ITEMS} />
            )}
          </li>
        </ul>
      </section>
      <section className="h-[50px] w-full border-b border-[#6f6f6f] bg-[#f2f2f2]"></section>
    </div>
  );
}