import { DEFAULT_IMAGE_DIR } from "../../../../constants";

export default function AuthMenu() {
  return (
    <div className="mx-auto flex w-full max-w-defualt-container items-center justify-between">
      <section>
        <img
          src={`${DEFAULT_IMAGE_DIR}/logo/gnb.jpeg`}
          className="h-[40px] w-auto"
          alt="gnb-logo"
        />
      </section>
      <section className="inline-flex items-center gap-[48px]">
        <div>
          <span className="text-[13px] text-[#111]">ACT Daniel[act01]</span>
        </div>
        <div className="inline-flex gap-[12px]">
          <button className="flex items-center gap-1">
            <img
              className="aspect-square w-[20px]"
              src={`${DEFAULT_IMAGE_DIR}/icons/ico-info-change.png`}
              alt="ico-info-change"
            />
            <span className="text-[13px] text-[#555]">개인정보 변경</span>
          </button>
          <button className="flex items-center gap-1">
            <img
              className="aspect-square w-[20px]"
              src={`${DEFAULT_IMAGE_DIR}/icons/ico-logout.png`}
              alt="ico-logout"
            />
            <span className="text-[13px] text-[#555]">로그아웃</span>
          </button>
        </div>
      </section>
    </div>
  );
}
