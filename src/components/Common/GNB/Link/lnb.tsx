import { CSSProperties } from "react";
import { Link } from "react-router-dom";

export default function LNBLink({
  text,
  url,
  active = false,
  style,
}: {
  text: string;
  url: string;
  active?: boolean;
  style?: CSSProperties;
}) {
  return (
    <Link
      to={url}
      style={{ ...style }}
      className={`relative flex h-full items-center text-[18px] font-bold ${
        active ? "text-[#007dc3] underline" : "text-[#555]"
      }`}
    >
      {text}
    </Link>
  );
}
