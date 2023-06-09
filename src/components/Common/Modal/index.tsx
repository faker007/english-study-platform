import { useEffect } from "react";
import { createPortal } from "react-dom";

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
    }
  }, [isOpen]);

  if (!isOpen) {
    return <></>;
  }

  const Content = (
    <div
      onClick={toggleOpen}
      className="fixed inset-0 z-[99] flex items-center justify-center bg-black bg-opacity-50"
    >
      <main
        style={style}
        className="overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children({ isOpen, toggleOpen })}
      </main>
    </div>
  );

  return createPortal(Content, document.body);
}
