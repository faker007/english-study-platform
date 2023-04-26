import { DEFAULT_IMAGE_DIR } from "../../../../../../constants";

function MiddleInstruction() {
  return (
    <section className="flex w-[76px] flex-shrink-0 flex-col gap-3">
      <img
        src={`${DEFAULT_IMAGE_DIR}/icons/ico-both-arrow.png`}
        alt="both-arrow-icon"
        width={76}
        height={76}
      />
      <span className="break-words">
        Ctrl / Shift 키를 누른 상태로 마우스를 클릭하면 복수 선택 가능
      </span>
    </section>
  );
}

export default MiddleInstruction;
