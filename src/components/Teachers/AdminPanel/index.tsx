import { useState } from "react";
import Modal from "../../Common/Modal";
import ModalContent from "./ModalContent";

export default function AdminControlPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-[10px]">
      <button
        onClick={toggleModalOpen}
        className="h-[36px] border border-[#007abe] bg-[#007abe] px-3 text-[13px] text-white"
      >
        신규등록
      </button>
      <button className="h-[36px] border border-[#007abe] bg-[#007abe] px-3 text-[13px] text-white">
        엑셀 등록 양식
      </button>
      <button className="h-[36px] border border-[#007abe] bg-[#007abe] px-3 text-[13px] text-white">
        엑셀 일괄 등록
      </button>
      <Modal
        isOpen={isModalOpen}
        toggleOpen={toggleModalOpen}
        width={750}
        height={510}
      >
        {(props) => <ModalContent {...props} />}
      </Modal>
    </div>
  );
}
