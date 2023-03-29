import { ILNBItem } from "../../../../types/GNB";
import LNBLink from "../Link/lnb";

interface IProps {
  data: ILNBItem[];
}

export default function LNBList({ data }: IProps) {
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
          />
        </li>
      ))}
    </ul>
  );
}
