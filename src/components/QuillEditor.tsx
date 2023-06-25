import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRecoilState } from "recoil";
import { storage } from "../firebase";
import { quillValue } from "../stores/problem";

export default function QuillEditor() {
  const quillRef = useRef(null);
  const [quillContent, setQuillContent] = useRecoilState(quillValue);

  const imageHandler = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.click();

    input.addEventListener("change", async () => {
      const editor = quillRef?.current!.getEditor()!;
      const file = input?.files![0];
      const range = editor.getSelection(true);

      try {
        // 파일명을 "image/Date.now()"로 저장
        const storageRef = ref(storage, `image/${Date.now()}`);

        // Firebase Method: uploadBytes, getDownloadURL
        await uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              // 이미지 URL 에디터에 삽입
              editor.insertEmbed(range.index, "image", url);

              // URL 삽입 후 커서를 이미지 뒷 칸으로 이동
              editor.setSelection(range.index + 1);
            })
            .catch((err) => {
              console.log("asfs");
            });
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
          ["image"],
        ],
        handlers: { image: imageHandler },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
  ];

  return (
    <ReactQuill
      ref={quillRef}
      onChange={(e) => {
        setQuillContent(e);
      }}
      style={{ width: "100%", height: 500 }}
      modules={modules}
      formats={formats}
      value={quillContent}
      placeholder={""}
      theme="snow"
    />
  );
}
