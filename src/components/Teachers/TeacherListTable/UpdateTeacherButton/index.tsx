import { useState } from "react";
import Modal from "../../../Common/Modal";
import ModalContent from "./ModalContent";
import { ITeacher } from "../../../../api/models";

function UpdateTeacherButton({ teacher }: { teacher: ITeacher }) {
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
        수정
      </button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen} width={750} height={580}>
        {(props) => <ModalContent {...props} teacher={teacher} />}
      </Modal>
    </>
  );
}

export default UpdateTeacherButton;
