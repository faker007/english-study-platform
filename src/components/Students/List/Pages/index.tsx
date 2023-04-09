import { DEFAULT_IMAGE_DIR } from "../../../../constants";
import Page from "./page";

export default function Pages() {
  return (
    <div className="flex items-center gap-[28px]">
      <nav className="space-x-[5px]">
        <button
          style={{
            backgroundImage: `url(${DEFAULT_IMAGE_DIR}/icons/ico-arrow-sprites.jpeg)`,
            backgroundPosition: "0px 0px",
          }}
          className="aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[#666]"
        ></button>
        <button
          style={{
            backgroundImage: `url(${DEFAULT_IMAGE_DIR}/icons/ico-arrow-sprites.jpeg)`,
            backgroundPosition: "-36px 0px",
          }}
          className="aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[#666]"
        ></button>
      </nav>
      <main className="space-x-1">
        <Page goto={1} active />
        <Page goto={2} />
        <Page goto={3} />
        <Page goto={4} />
        <Page goto={5} />
      </main>
      <nav className="space-x-[5px]">
        <button
          style={{
            backgroundImage: `url(${DEFAULT_IMAGE_DIR}/icons/ico-arrow-sprites.jpeg)`,
            backgroundPosition: "0px -36px",
          }}
          className="aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[#666]"
        ></button>
        <button
          style={{
            backgroundImage: `url(${DEFAULT_IMAGE_DIR}/icons/ico-arrow-sprites.jpeg)`,
            backgroundPosition: "-36px -36px",
          }}
          className="aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[#666]"
        ></button>
      </nav>
    </div>
  );
}
