import { IStudentGroup } from "../../../../../../api/models";
import { IModalContentArgs } from "../../../../../Common/Modal";
import ModalFrame from "../../../../../Common/Modal/ModalFrame";
import ConnectStudentToGroupForm from "./ConnectStudentToGroupForm";
import DisconnectStudentFromGroupForm from "./DisconnectStudentFromGroupForm";
import MiddleInstruction from "./MiddleInstruction";

interface IProps extends IModalContentArgs {
  currentGroup: IStudentGroup;
}

function ModalContent({ isOpen, toggleOpen, currentGroup }: IProps) {
  return (
    <ModalFrame
      title="학생 그룹 - 학생 연결"
      containerClassname="!p-0"
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <div className="flex items-center gap-[30px] px-5 pt-5">
        <ConnectStudentToGroupForm currentGroup={currentGroup} />
        <MiddleInstruction />
        <DisconnectStudentFromGroupForm currentGroup={currentGroup} />
      </div>
    </ModalFrame>
  );
}

export default ModalContent;
