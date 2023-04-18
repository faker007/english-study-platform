/** 문제 세트 */
import React, { useEffect, useRef, useState } from "react";
import Spacer from "../components/Common/Spacer";
import Modal, { IModalContentArgs } from "../components/Common/Modal";

import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

// import react-quill and css
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ProblemBank() {
  const [problemSetName, setProblemSetName] = useState("");
  const [problemSets, setProblemSets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  function 문제_편집_모달_토글() {
    setIsOpen((prev) => !prev);
  }

  // TODO: Extract this function as a hook
  const 신규_등록 = async () => {
    if (!problemSetName) {
      return alert("문제 세트 명을 등록 해주세요");
    }

    const problemSetCF = collection(db, "problemSet");

    try {
      const result = await addDoc(problemSetCF, {
        problemSetName: problemSetName,
        length: 0,
      });

      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const 문제_편집 = async () => {};

  const 문제_내용_확인 = async () => {};

  const 세트명_변경 = async () => {};

  const 세트_삭제 = async () => {};

  const 데이터_가져오기 = async () => {
    const tempArray: any = [];
    const problemSetCF = collection(db, "problemSet");

    const ProblemSetDocs = await getDocs(problemSetCF);

    ProblemSetDocs.forEach((problemSetDoc) => {
      tempArray.push({ id: problemSetDoc.id, ...problemSetDoc.data() });
      console.log(problemSetDoc);
      console.log(problemSetDoc.data());
    });

    setProblemSets(tempArray);
  };

  // Initial useEffect
  useEffect(() => {
    데이터_가져오기();
  }, []);

  return (
    <div className="max-w-8xl flex flex-col px-32">
      <Spacer height={30} />

      <h1 style={{ fontSize: 26, fontWeight: 700 }}>문제 세트</h1>

      <Spacer height={30} />

      <div
        style={{
          height: 79,
          borderWidth: 1,
          borderColor: "#e0e0e0",
          backgroundColor: "#f7f7f7",
        }}
      />

      <Spacer height={30} />

      <p>Tip: 아래 목록은 세트 번호 역순으로 정렬 됩니다.</p>

      <Spacer height={30} />

      <table>
        <thead>
          <th scope="col">No.</th>
          <th scope="col">세트명</th>
          <th scope="col">문제수</th>
          <th scope="col">실행</th>
        </thead>
        <tbody>
          <tr>
            <td>-</td>
            <td>
              <input
                type="text"
                style={{ border: "1px solid #555", textAlign: "center" }}
                placeholder="문제 세트명 입력"
                value={problemSetName}
                onChange={(e) => {
                  setProblemSetName(e.target.value);
                  console.log(e.target.value);
                }}
              />
            </td>
            <td>-</td>
            <td>
              <button
                style={{
                  width: 76,
                  height: 30,
                  backgroundColor: "#fff",
                  border: "1px solid #d9d9d9",
                  fontSize: 13,
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: 6,
                }}
                onClick={() => {
                  신규_등록();
                }}
              >
                신규 등록
              </button>
            </td>
          </tr>
          {problemSets.map((problemSet: any) => {
            console.log(problemSet);
            return (
              <tr>
                <td>-</td>
                <td>
                  <p style={{ textAlign: "center" }}>
                    {problemSet.problemSetName}
                  </p>
                  {/* <input
                    type="text"
                    style={{ border: "1px solid #555", textAlign: "center" }}
                    placeholder="문제 세트명 입력"
                    value={problemSetName}
                    onChange={(e) => {
                      setProblemSetName(e.target.value);
                      console.log(e.target.value);
                    }}
                  /> */}
                </td>
                <td>{problemSet?.length ?? "-"}</td>
                <td>
                  <button
                    style={{
                      width: 76,
                      height: 30,
                      backgroundColor: "#fff",
                      border: "1px solid #d9d9d9",
                      fontSize: 13,
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: 6,
                    }}
                    onClick={() => {
                      문제_편집_모달_토글();
                    }}
                  >
                    문제 편집
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal isOpen={isOpen} toggleOpen={문제_편집_모달_토글} fullscreen>
        {(props) => <ModalComponent {...props} />}
      </Modal>
    </div>
  );
}

function ModalComponent({ toggleOpen }: IModalContentArgs) {
  const [isShowQuill, setIsShowQuill] = useState(false);
  // const quillRef = useRef(null);

  // TODO: 지문_추가
  const 지문_추가 = async () => {};

  // TODO: 지문_없음_추가
  const 지문_없음_추가 = async () => {};

  // TODO: 새로 고침
  const 새로_고침 = async () => {};

  return (
    <div className="flex">
      <div className="flex h-full w-full items-center gap-3 bg-white p-5">
        <span className="text-2xl font-medium">지문 목록</span>

        <button
          onClick={toggleOpen}
          className="rounded-md bg-rose-500 px-5 py-2 text-white"
        >
          지문 추가
        </button>
        <button
          onClick={toggleOpen}
          className="rounded-md bg-rose-500 px-5 py-2 text-white"
        >
          지문 없음 추가
        </button>
        <button
          onClick={toggleOpen}
          className="rounded-md bg-rose-500 px-5 py-2 text-white"
        >
          새로 고침
        </button>
      </div>

      <Spacer width={10} />

      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white p-5">
        <ReactQuill style={{ width: "100%", height: "200" }} />
      </div>
    </div>
  );
}
