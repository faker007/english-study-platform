import { useEffect } from "react";

export interface IModalContentArgs {
  isOpen: boolean;
  toggleOpen: () => void;
}

interface IProps extends IModalContentArgs {
  children: (props: IModalContentArgs) => JSX.Element;
  width?: string | number;
  height?: string | number;
  fullscreen?: boolean;
}

export default function Modal({
  children,
  isOpen,
  toggleOpen,
  height,
  width,
  fullscreen,
}: IProps) {
  const style: React.CSSProperties = {
    width: width ? width : fullscreen ? "95%" : "",
    height: height ? height : fullscreen ? "95%" : "",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) {
    return <></>;
  }

  return (
    <div
      onClick={toggleOpen}
      className="fixed inset-0 z-[99] flex items-center justify-center bg-black bg-opacity-50"
    >
      <main style={style} onClick={(e) => e.stopPropagation()}>
        {children({ isOpen, toggleOpen })}
      </main>
    </div>
  );
}
