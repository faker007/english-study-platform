import { CSSProperties } from "react";

export default function GNBLink({
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
    <a
      href={url}
      style={style}
      className="relative flex h-full items-center text-[18px] font-bold text-[#555]"
    >
      {text}
      {active && (
        <aside className="absolute top-0 left-0 h-[5px] w-full bg-[#005aab]" />
      )}
    </a>
  );
}
