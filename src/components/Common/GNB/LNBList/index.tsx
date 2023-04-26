import { useLocation } from "react-router-dom";
import { ILNBItem } from "../../../../types/GNB";
import LNBLink from "../Link/lnb";

interface IProps {
  data: ILNBItem[];
}

export default function LNBList({ data }: IProps) {
  const { pathname } = useLocation();

  return (
    <ul className="absolute flex h-[50px] gap-[20px]">
      {data.map((item) => (
        <li
          key={item.text}
          className="inline-flex h-full items-center whitespace-nowrap"
        >
          <LNBLink
            text={item.text}
            url={item.url}
            style={{ fontSize: 14 }}
            active={item.url === pathname}
          />
        </li>
      ))}
    </ul>
  );
}
