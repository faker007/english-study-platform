import { PropsWithChildren } from "react";

export function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-defualt-container">{children}</div>
  );
}
