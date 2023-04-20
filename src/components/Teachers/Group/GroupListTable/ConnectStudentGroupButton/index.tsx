import { useState } from "react";
import Modal from "../../../../Common/Modal";
import { ITeacherGroup } from "../../../../../api/models";
import ModalContent from "./ModalContent";

interface IProps {
  currentGroup: ITeacherGroup;
}

export default function ConnectStudentGroupButton({ currentGroup }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        onClick={toggleOpen}
        className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
      >
        학생그룹 연결
      </button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen} width={750} height={650}>
        {(modalProps) => (
          <ModalContent {...modalProps} currentGroup={currentGroup} />
        )}
      </Modal>
    </>
  );
}
