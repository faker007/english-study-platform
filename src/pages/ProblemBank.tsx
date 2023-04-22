// TODO: [ O ] 2023-04-22 12:47 -> 문제 세트의 Doc id를 물고, Modal open 하기, 사유: 그래야, 문제 세트와 지문을 1:1로 대응할 수 있음.
// TODO: [ X ] 2023-04-22 12:57 -> 지문 목록(jimuns)의 Doc id을 물고, 문제 목록에서 문제 추가할 수 있도록 구현.
// TODO: [ X ] 2023-04-22 12:57 -> 지문 목록(jimuns)의 Doc id을 물고, 수정할 수 있도록 구현.

/** 문제 세트 */
import React, { useEffect, useRef, useState } from "react";
import Spacer from "../components/Common/Spacer";
import Modal, { IModalContentArgs } from "../components/Common/Modal";

import { db } from "../firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

// import react-quill and css
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ProblemBank() {
  const [problemSetName, setProblemSetName] = useState("");
  const [problemSets, setProblemSets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(""); // 문제 세트, FB Doc id, Modal에서도 사용.

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
            return (
              <tr>
                <td>-</td>

                <td>
                  <p style={{ textAlign: "center" }}>
                    {problemSet.problemSetName}
                  </p>
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
                      setCurrentDocId(problemSet.id);

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
        {(props) => <ModalComponent {...props} currentDocId={currentDocId} />}
      </Modal>
    </div>
  );
}

function ModalComponent({
  toggleOpen,
  currentDocId,
}: IModalContentArgs & { currentDocId: string }) {
  const [title, setTitle] = useState("");
  const [isShowQuill, setIsShowQuill] = useState(false);
  const [quillContent, setQuillContent] = useState("");
  const [jimuns, setJimuns] = useState([]);
  // const quillRef = useRef(null);

  // TODO: 지문_추가
  const 지문_추가 = async () => {};

  const 지문_추가_저장 = async () => {
    const jimunSetCF = collection(db, "jimuns");

    if (!title) {
      return alert("제목을 입력해주세요!");
    }

    if (!quillContent) {
      return alert("지문 정보를 입력해주세요!");
    }

    if (!currentDocId) {
      return alert(
        "세트명 아이디를 가져올 수 없습니다. 새로고침 후 다시 시도해주세요."
      );
    }

    try {
      const result = await addDoc(jimunSetCF, {
        title,
        quillContent,
        length: 0,
        currentDocId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  // TODO: 지문_없음_추가
  const 지문_없음_추가 = async () => {};

  // TODO: 새로 고침
  const 새로_고침 = async () => {};

  const 데이터_가져오기 = async () => {
    const tempArray: any = [];
    const jimunsCF = collection(db, "jimuns");
    const q = query(jimunsCF, where("currentDocId", "==", currentDocId));
    const jimunsDocs = await getDocs(q);

    jimunsDocs.forEach((jimunsDoc) => {
      tempArray.push({ id: jimunsDoc.id, ...jimunsDoc.data() });
      console.log(jimunsDoc);
      console.log(jimunsDoc.data());
    });

    setJimuns(tempArray);
  };

  useEffect(() => {
    const inner = async () => {
      데이터_가져오기();
    };

    inner();
  }, []);

  return (
    <div className="flex">
      <div className="flex h-full w-full flex-col items-center gap-3 bg-white p-5">
        <div className="flex flex-row">
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

        <div className="w-full">
          <table className="w-full">
            <thead>
              <th scope="col">선택</th>
              <th scope="col">지문 제목</th>
              <th scope="col">문제 수</th>
              <th scope="col">실행</th>
            </thead>
            <tbody>
              {jimuns.map((jimun: any) => {
                return (
                  <tr
                    onClick={() => {
                      console.log(jimun.quillContent);
                      setQuillContent(
                        jimun.quillContent ?? "<p>No content</p>"
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <input type="radio" />
                    </td>
                    <td>
                      <p>{jimun.title}</p>
                    </td>
                    <td>{jimun.length ?? "0"}</td>
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
                        onClick={() => {}}
                      >
                        수정
                      </button>
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
                        onClick={() => {}}
                      >
                        삭제
                      </button>
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
                        onClick={() => {}}
                      >
                        위로
                      </button>
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
                        onClick={() => {}}
                      >
                        아래로
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Spacer width={10} />

      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white p-5">
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 40,
            borderBottomWidth: 3,
            borderBottomColor: "black",
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 400 }}>지문 정보</h1>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            height: 50,
            borderBottomWidth: 3,
            borderBottomColor: "black",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <h3>지문제목</h3>

          <input
            type="text"
            style={{
              width: "85%",
              height: 30,
              backgroundColor: "#fafafa",
              marginLeft: 30,
            }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>

        <ReactQuill
          style={{ width: "100%", height: "200" }}
          onChange={(value) => {
            setQuillContent(value);
          }}
          value={quillContent}
        />

        <button
          onClick={지문_추가_저장}
          className="rounded-md bg-rose-500 px-5 py-2 text-white"
        >
          저장
        </button>
      </div>
    </div>
  );
}
