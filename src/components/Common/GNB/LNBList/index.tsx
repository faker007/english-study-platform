import { ILNBItem } from "../../../../types/GNB";
import LNBLink from "../LNBLink";

export default function LNBList({ data }: { data: ILNBItem[] }) {
  return (
    <ul className="absolute flex h-[50px] gap-[20px]">
      {data.map((item) => (
        <li
          key={item.url}
          className="inline-flex h-full items-center whitespace-nowrap"
        >
          <LNBLink
            text={item.text}
            url={item.url}
            style={{ fontSize: 14 }}
            active
          ></LNBLink>
        </li>
      ))}
    </ul>
  );
}
