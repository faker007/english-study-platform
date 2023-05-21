// TODO: [ O ] 2023-04-22 12:47 -> 문제 세트의 Doc id를 물고, Modal open 하기, 사유: 그래야, 문제 세트와 지문을 1:1로 대응할 수 있음.
// TODO: [ X ] 2023-04-22 12:57 -> 지문 목록(jimuns)의 Doc id을 물고, 문제 목록에서 문제 추가할 수 있도록 구현.
// TODO: [ X ] 2023-04-22 12:57 -> 지문 목록(jimuns)의 Doc id을 물고, 수정할 수 있도록 구현.
// TODO: [ ] 2023-05-21 10:17 -> problemSet에서 latestOrder를 통해서, "아래로", "위로" 정렬할 수 있도록 구현

/** 문제 세트 */
import React, { useEffect, useRef, useState } from "react";
import Spacer from "../components/Common/Spacer";
import Modal, { IModalContentArgs } from "../components/Common/Modal";

import { db } from "../firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { modules, formats } from "../components/EditorToolbar";

export default function ProblemBank() {
  const [problemSetName, setProblemSetName] = useState("");
  const [problemSets, setProblemSets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(""); // 문제 세트, FB Doc id, Modal에서도 사용.

  function 문제_편집_모달_토글() {
    setIsOpen((prev) => !prev);
  }

  const 신규_등록 = async () => {
    if (!problemSetName) {
      return alert("문제 세트 명을 등록 해주세요");
    }

    const problemSetCF = collection(db, "problemSet");

    try {
      const result = await addDoc(problemSetCF, {
        problemSetName: problemSetName,
        length: 0,
        latestOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        데이터_가져오기();

        alert("신규 등록에 성공 했습니다!");
      } catch (err) {
        alert("신규 등록에 실패 했습니다!");
      }
    } catch (err) {
      console.log(err);

      alert("신규 등록에 실패 했습니다!");
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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

                    <Spacer width={10} />

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
                      세트명 편집
                    </button>

                    <Spacer width={10} />

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
                      세트 삭제
                    </button>
                  </div>
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
  const [isJimun, setIsJimin] = useState(true); // true: 지문 추가, false: 문제 추가
  // const quillRef = useRef(null);

  // NOTE: 이 앱에서는 지문_추가가 기본 옵션임.
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

  const 지문_없음_추가 = async () => {
    const jimunSetCF = collection(db, "jimuns");

    if (!currentDocId) {
      return alert(
        "세트명 아이디를 가져올 수 없습니다. 새로고침 후 다시 시도해주세요."
      );
    }

    try {
      const result = await addDoc(jimunSetCF, {
        title: "(지문 없음)",
        quillContent: "",
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

  // TODO: 문제 추가
  const 문제_추가 = async () => {
    // TODO: react-quill 초기화
    setIsJimin(true);

    setIsShowQuill(!isShowQuill);
  };

  // TODO: 해설 이미지 업로드 추가
  const 해설_이미지_업로드 = async () => {};

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

  // TODO: 문제별_지문_설정
  const 문제별_지문_설정 = async () => {};

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
            onClick={지문_없음_추가}
            className="rounded-md bg-rose-500 px-5 py-2 text-white"
          >
            지문 없음 추가
          </button>
          <button
            onClick={데이터_가져오기}
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
              {jimuns?.map((jimun: any) => {
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
                      {/* TODO: 필요하다면, 수정 추가 */}
                      {/* <button
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
                      </button> */}
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

        {/* 문제 목록 */}
        <div className="flex flex-row">
          <span className="text-2xl font-medium">문제 목록</span>

          <button
            onClick={() => {
              문제_추가();
            }}
            className="rounded-md bg-rose-500 px-5 py-2 text-white"
          >
            문제 추가
          </button>

          <button
            onClick={toggleOpen}
            className="rounded-md bg-rose-500 px-5 py-2 text-white"
          >
            문제별 지문 설정
          </button>
        </div>
      </div>

      <Spacer width={10} />

      {isShowQuill ? (
        <ProblemInfoComponent isJimun={isJimun} />
      ) : (
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

          <div className="text-editor">
            <EditorToolbar />

            <ReactQuill
              style={{ width: "100%", height: 500 }}
              onChange={(value) => {
                setQuillContent(value);
              }}
              value={quillContent}
              modules={modules}
              formats={formats}
            />
          </div>

          <button
            onClick={지문_추가_저장}
            className="rounded-md bg-rose-500 px-5 py-2 text-white"
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
}

/** 문제 추가 오른쪽 컴포넌트 */
function ProblemInfoComponent({ isJimun }: { isJimun: boolean }) {
  const [selectedValue, setSelectedValue] = useState("단일 선택"); // 응답 유형 ("단일 선택", "복수 선택", "단답형")
  const [selectedValue2, setSelectedValue2] = useState("100"); // 기호 유형 (100 ~ 700)
  const [selectedValue3, setSelectedValue3] = useState("A"); // 정답 ("A", "B", "C", "D")
  const [score, setScore] = useState(1); // 배점
  const [quillContent, setQuillContent] = useState("");

  return (
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
        <h1 style={{ fontSize: 24, fontWeight: 400 }}>
          {isJimun ? "문제 정보" : "문제 추가"}
        </h1>
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
        <h3>문제 정보</h3>
      </div>

      <div className="text-editor">
        <EditorToolbar />

        <ReactQuill
          style={{ width: "100%", height: 500 }}
          onChange={(value) => {
            setQuillContent(value);
          }}
          value={quillContent}
          modules={modules}
          formats={formats}
        />
      </div>

      <Spacer height={50} />

      <div className="flex">
        <div className="flex flex-col">
          <p>해설 이미지</p>
          <p>해시 태그</p>
          <p>응답 유형</p>
          <p>기호 유형</p>
          <p>정답</p>
          <p>배점</p>
          <p>문제 유형</p>
        </div>

        <div className="flex flex-col">
          <input type={"text"} />
          <input type={"text"} />
          {/* 응답 유형 */}
          <div className="flex">
            {["단일 선택", "복수 선택", "단답형"].map((value, i) => {
              return (
                <>
                  <input
                    id={"mondais" + i}
                    name={"mondais" + i}
                    value={value}
                    type={"radio"}
                    checked={selectedValue === value}
                    onChange={(e) => {
                      setSelectedValue(e.target.value);
                      console.log(e.target.value);
                    }}
                  />

                  <p>{value}</p>

                  <Spacer width={10} />
                </>
              );
            })}
          </div>

          {/* 기호 유형 */}
          <select
            onChange={(e) => {
              setSelectedValue2(e.target.value);

              console.log(selectedValue2);
            }}
          >
            <option value="100">A, B, C, D</option>
            <option value="200">A, B, C, D, E</option>
            <option value="300">F, G, H, J</option>
            <option value="400">F, G, H, J, K</option>
            <option value="500">1, 2, 3, 4</option>
            <option value="600">1, 2, 3, 4, 5</option>
            <option value="700">T, F, T, F, C, E</option>
          </select>

          {/* 정답 */}
          <div className="flex">
            {["A", "B", "C", "D"].map((value, i) => {
              return (
                <>
                  <input
                    type={"radio"}
                    id={"correctAnswer" + i}
                    name={"correctAnswer" + i}
                    value={value}
                    checked={selectedValue3 === value}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setSelectedValue3(e.target.value);
                    }}
                  />

                  <p>{value}</p>

                  <Spacer width={10} />
                </>
              );
            })}
          </div>

          {/* 배점 */}
          <select
            onChange={(e) => {
              setScore(Number(e.target.value));

              console.log("배점: " + e.target.value);
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          {/* 문제 유형 */}
          <select onChange={() => {}}>
            <option value="1">(문제 유형 없음)</option>
          </select>
          <input type={"text"} />
        </div>
      </div>
      {/* TODO: 해설 이미지 input type: image */}

      {/* TODO: 해시 태그 input type: text */}

      <button
        onClick={async () => {
          const problemInfoCF = collection(db, "problemInfo");

          try {
            const result = await addDoc(problemInfoCF, {
              quillContent,
              resType: selectedValue, // 응답 유형
              typoType: Number(selectedValue2), // 기호 유형
              correctAnswer: selectedValue3, // 정답
              score: Number(score), // 배점
              problemType: "(문제 유형 없음)", // TODO: Do not hard-coded here
            });

            console.log(result);
          } catch (err) {
            console.log(err);
          }
        }}
        className="rounded-md bg-rose-500 px-5 py-2 text-white"
      >
        저장
      </button>
    </div>
  );
}
