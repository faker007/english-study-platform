import { useEffect, useState } from "react";
import { DEFAULT_IMAGE_DIR } from "../../../../constants";
import { MIN_PAGE } from "../../../../constants/Students";
import Page from "./page";

interface IProps {
  page: number;
  lastPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const MAXIMUM_PAGES_COLUMNS = 10;

export default function Pages({ lastPage, page, setPage }: IProps) {
  const [tens, setTens] = useState(0);

  function handleClickPrevPage() {
    setPage((prev) => {
      return Math.max(MIN_PAGE, prev - 1);
    });
  }

  function handleClickNextPage() {
    setPage((prev) => Math.min(lastPage, prev + 1));
  }

  function handleClickFirstPage() {
    setPage(MIN_PAGE);
  }

  function handleClickLastPage() {
    setPage(lastPage);
  }

  useEffect(() => {
    const tens =
      page % MAXIMUM_PAGES_COLUMNS
        ? Math.floor(page / MAXIMUM_PAGES_COLUMNS)
        : Math.floor(page / MAXIMUM_PAGES_COLUMNS) - 1;
    setTens(tens);
  }, [page]);

  console.log(page, tens, lastPage);

  return (
    <div className="flex items-center gap-[28px]">
      <nav className="space-x-[5px]">
        <button
          style={{
            backgroundImage: `url(${DEFAULT_IMAGE_DIR}/icons/ico-arrow-sprites.jpeg)`,
            backgroundPosition: "0px 0px",
          }}
          onClick={handleClickFirstPage}
          className="aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[#666]"
        ></button>
        <button
          style={{
            backgroundImage: `url(${DEFAULT_IMAGE_DIR}/icons/ico-arrow-sprites.jpeg)`,
            backgroundPosition: "-36px 0px",
          }}
          onClick={handleClickPrevPage}
          className="aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[#666]"
        ></button>
      </nav>
      <main className="flex items-center gap-[1px]">
        {Array.from({
          length: Math.min(MAXIMUM_PAGES_COLUMNS, lastPage - 10 * tens),
        }).map((_, i) => {
          const pageValue = 10 * tens + (i + 1);
          return (
            <div key={pageValue} onClick={() => setPage(pageValue)}>
              <Page value={pageValue} active={pageValue === page} />
            </div>
          );
        })}
      </main>
      <nav className="space-x-[5px]">
        <button
          style={{
            backgroundImage: `url(${DEFAULT_IMAGE_DIR}/icons/ico-arrow-sprites.jpeg)`,
            backgroundPosition: "0px -36px",
          }}
          onClick={handleClickNextPage}
          className="aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[#666]"
        ></button>
        <button
          style={{
            backgroundImage: `url(${DEFAULT_IMAGE_DIR}/icons/ico-arrow-sprites.jpeg)`,
            backgroundPosition: "-36px -36px",
          }}
          onClick={handleClickLastPage}
          className="aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[#666]"
        ></button>
      </nav>
    </div>
  );
}
