// TODO: Delete this file if you dont use anymore
export {};
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import React from "react";
// import { Quill } from "react-quill";
// import { storage } from "../firebase";

// // Add sizes to whitelist and register them
// const Size = Quill.import("formats/size");
// Size.whitelist = ["extra-small", "small", "medium", "large"];

// Quill.register(Size, true);

// // Add fonts to whitelist and register them
// const Font = Quill.import("formats/font");

// Font.whitelist = [
//   "arial",
//   "comic-sans",
//   "courier-new",
//   "georgia",
//   "helvetica",
//   "lucida",
// ];

// Quill.register(Font, true);

// export const imageHandler = ({ quillRef }: { quillRef?: any }) => {
//   const input = document.createElement("input");

//   input.setAttribute("type", "file");
//   input.setAttribute("accept", "image/*");
//   input.click();

//   input.addEventListener("change", async () => {
//     const editor = quillRef.current.getEditor();
//     const file = input?.files![0];
//     const range = editor.getSelection(true);

//     try {
//       // 파일명을 "image/Date.now()"로 저장
//       const storageRef = ref(storage, `image/${Date.now()}`);

//       // Firebase Method: uploadBytes, getDownloadURL
//       await uploadBytes(storageRef, file).then((snapshot) => {
//         getDownloadURL(snapshot.ref)
//           .then((url) => {
//             // 이미지 URL 에디터에 삽입
//             editor.insertEmbed(range.index, "image", url);

//             // URL 삽입 후 커서를 이미지 뒷 칸으로 이동
//             editor.setSelection(range.index + 1);
//           })
//           .catch((err) => {
//             console.log("asfs");
//           });
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   });
// };

// // Modules object for setting up the Quill editor
// export const modules = {
//   toolbar: {
//     container: "#toolbar",
//     handlers: {
//       undo: () => {},
//       redo: () => {},
//       image: () => {
//         // imageHandler(null);
//       },
//     },
//   },
//   history: {
//     delay: 500,
//     maxStack: 100,
//     userOnly: true,
//   },
// };

// // Formats objects for setting up the Quill editor
// export const formats = [
//   "header",
//   "font",
//   "size",
//   "bold",
//   "italic",
//   "underline",
//   "align",
//   "strike",
//   "script",
//   "blockquote",
//   "background",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "image",
//   "color",
//   "code-block",
// ];

// export const QuillToolbar = ({ quillRef }: { quillRef?: any }) => {
//   return (
//     <div id="toolbar">
//       <span className="ql-formats">
//         <select className="ql-font" defaultValue="arial">
//           <option value="arial"> Arial </option>
//           <option value="comic-sans"> Comic Sans </option>
//           <option value="courier-new"> Courier New </option>
//           <option value="georgia"> Georgia </option>
//           <option value="helvetica"> Helvetica </option>
//           <option value="lucida"> Lucida </option>
//         </select>

//         <select className="ql-size" defaultValue="medium">
//           <option value="extra-small">아주 작게</option>
//           <option value="small">작게</option>
//           <option value="medium">보통</option>
//           <option value="large">크게</option>
//         </select>

//         <select className="ql-header" defaultValue="3">
//           <option value="1">Heading</option>
//           <option value="2">Subheading</option>
//           <option value="3">Normal</option>
//         </select>
//       </span>

//       <span className="ql-formats">
//         <button className="ql-bold" />
//         <button className="ql-italic" />
//         <button className="ql-underline" />
//         <button className="ql-strike" />
//       </span>
//       <span className="ql-formats">
//         <button className="ql-list" value="ordered" />
//         <button className="ql-list" value="bullet" />
//         <button className="ql-indent" value="-1" />
//         <button className="ql-indent" value="+1" />
//       </span>
//       <span className="ql-formats">
//         <button className="ql-script" value="super" />
//         <button className="ql-script" value="sub" />
//         <button className="ql-blockquote" />
//         <button className="ql-direction" />
//       </span>
//       <span className="ql-formats">
//         <select className="ql-align" />
//         <select className="ql-color" />
//         <select className="ql-background" />
//       </span>
//       <span className="ql-formats">
//         <button className="ql-link" />
//         <button className="ql-image" />
//         <button className="ql-video" />
//       </span>
//       <span className="ql-formats">
//         <button className="ql-formula" />
//         <button className="ql-code-block" />
//         <button className="ql-clean" />
//       </span>
//       <span className="ql-formats">
//         <button className="ql-undo">{/* <CustomUndo /> */}</button>
//         <button className="ql-redo">{/* <CustomRedo /> */}</button>
//       </span>
//     </div>
//   );
// };

// export default QuillToolbar;
