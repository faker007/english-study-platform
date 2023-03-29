import { useState } from "react";
import { DefaultLayout } from "./components/Common/DefaultLayout";
import Modal, { IModalContentArgs } from "./components/Common/Modal";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  function togglOpen() {
    setIsOpen((prev) => !prev);
  }

  return (
    <DefaultLayout>
      <button
        onClick={togglOpen}
        className="rounded-md bg-black px-10 py-3 font-medium text-white"
      >
        Toggle Modal
      </button>
      <Modal width={300} height={200} isOpen={isOpen} toggleOpen={togglOpen}>
        {ModalContent}
      </Modal>
    </DefaultLayout>
  );
}

export default App;

function ModalContent({ toggleOpen }: IModalContentArgs) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white p-5">
      <span className="text-2xl font-medium">Hello React!</span>
      <button
        onClick={toggleOpen}
        className="rounded-md bg-rose-500 px-10 py-3 text-white"
      >
        Toggle Modal
      </button>
    </div>
  );
}
