// TODO: [ ] 2023-05-21 10:17 -> problemSet에서 latestOrder를 통해서, "아래로", "위로" 정렬할 수 있도록 구현

import "react-quill/dist/quill.snow.css";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
/** 문제 세트 */
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import Modal, { IModalContentArgs } from "../components/Common/Modal";
import Spacer from "../components/Common/Spacer";
import QuillEditor from "../components/QuillEditor";
import { db, storage } from "../firebase";
import {
  currentFocusedJimunIdState,
  currentFocusedProblemIdState,
  problemCorrectAnswerState,
  problemInfosState,
  problemResponseTypeState,
  problemScoreState,
  problemSymbolTypeState,
  shortAnswerState,
} from "../recoil";
import { quillValue } from "../stores/problem";

export default function ProblemBank() {
  const [problemSetName, setProblemSetName] = useState("");
  const [problemSets, setProblemSets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(""); // 문제 세트, FB Doc id, Modal에서도 사용.
  const setQuillContent = useSetRecoilState(quillValue);
  const setCurrentFocusedProblemDocId = useSetRecoilState(
    currentFocusedProblemIdState
  );
  const setCurrentFocusedDocId = useSetRecoilState(currentFocusedJimunIdState);

  function 문제_편집_모달_토글() {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setCurrentFocusedDocId("");
      setCurrentFocusedProblemDocId("");
      setQuillContent("");
    }
  }

  const 신규_등록 = async () => {
    if (!problemSetName) {
      return alert("문제 세트 명을 등록 해주세요");
    }

    const problemSetCF = collection(db, "problemSet");

    try {
      await addDoc(problemSetCF, {
        problemSetName,
        length: 0,
        latestOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        데이터_가져오기();

        setProblemSetName("");

        alert("신규 등록에 성공 했습니다!");
      } catch (err) {
        alert("신규 등록에 실패 했습니다!");
      }
    } catch (err) {
      console.log(err);

      alert("신규 등록에 실패 했습니다!");
    }
  };

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
                      onClick={async () => {
                        try {
                          await deleteDoc(doc(db, "problemSet", problemSet.id));

                          await 데이터_가져오기();

                          alert("성공적으로 문제 세트를 지웠습니다");
                        } catch (err) {
                          alert("문제 세트를 삭제 하는데 문제가 있습니다.");
                        }
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
  const [jimuns, setJimuns] = useState([]);
  const [problemInfos, setProblemInfos] = useRecoilState(problemInfosState);
  const [isJimun, setIsJimin] = useState(true); // true: 지문 추가, false: 문제 추가

  const [quillContent, setQuillContent] = useRecoilState(quillValue);
  const [curentFocusedProblemDocId, setCurrentFocusedProblemDocId] =
    useRecoilState(currentFocusedProblemIdState);
  const [currentFocusedDocId, setCurrentFocusedDocId] = useRecoilState(
    currentFocusedJimunIdState
  );

  const setProblemResponseType = useSetRecoilState(problemResponseTypeState);
  const setProblemSymbol = useSetRecoilState(problemSymbolTypeState);
  const setProblemCorrectAnswer = useSetRecoilState(problemCorrectAnswerState);
  const setProblemScore = useSetRecoilState(problemScoreState);

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
      await addDoc(jimunSetCF, {
        title,
        quillContent,
        length: 0,
        currentDocId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await 데이터_가져오기();
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

    setCurrentFocusedDocId("");
    setCurrentFocusedProblemDocId("");
    setQuillContent("");

    try {
      await addDoc(jimunSetCF, {
        title: "(지문 없음)",
        quillContent: "",
        length: 0,
        currentDocId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 지문 데이터 가져오기
      await 데이터_가져오기();
    } catch (err) {
      console.error(err);
    }
  };

  const 문제_추가 = async () => {
    if (currentFocusedDocId) {
      setIsShowQuill(true);

      setQuillContent("");

      setCurrentFocusedProblemDocId("");

      setProblemResponseType("단일 선택");
      setProblemSymbol("100");
      setProblemCorrectAnswer("A");
      setProblemScore("1");
    } else {
      alert("문제를 연결할 지문을 선택 해주세요");
    }
  };

  const 데이터_가져오기 = async () => {
    const tempArray: any[] = [];
    const jimunsRef = collection(db, "jimuns");
    const q = query(jimunsRef, where("currentDocId", "==", currentDocId));
    const jimunsDocs = await getDocs(q);

    jimunsDocs.forEach((jimunsDoc) => {
      tempArray.push({ id: jimunsDoc.id, ...jimunsDoc.data() });
    });

    tempArray.sort((a, b) => {
      const orderA = a?.order ?? 0;
      const orderB = b?.order ?? 0;

      return orderA - orderB;
    });

    setJimuns(tempArray);
  };

  /**
   * @description 지문 문제 갯수 렌더링
   */
  useEffect(() => {
    if (!jimuns.length) {
    }
  }, [jimuns]);

  // NOTE: 지문 목록 가져 오기
  useEffect(() => {
    const inner = async () => {
      데이터_가져오기();
    };

    inner();
  }, []);

  // NOTE: 문제 목록 가져 오기
  const 문제_목록_가져오기 = async () => {
    const tempArray: any[] = [];

    if (!currentFocusedDocId) {
      setProblemInfos(tempArray);

      return;
    }

    if (currentFocusedDocId) {
      const problemInfoCF = collection(db, "problemInfo");
      const q = query(
        problemInfoCF,
        where("connectedJimunId", "==", currentFocusedDocId)
      );

      const problemInfoDocs = await getDocs(q);

      problemInfoDocs.forEach((probemInfoDoc) => {
        tempArray.push({ id: probemInfoDoc.id, ...probemInfoDoc.data() });
      });

      tempArray.sort((a, b) => {
        const orderA = a?.order ?? 0;
        // @ts-ignore
        const orderB = b?.order ?? 0;

        // @ts-ignore
        return orderA - orderB;
      });

      setProblemInfos(tempArray);
    }
  };

  useEffect(() => {
    const inner = async () => {
      문제_목록_가져오기();
    };

    inner();
  }, [currentFocusedDocId]);

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
              {jimuns?.map((jimun: any, index: number) => {
                console.log(JSON.stringify(jimun, null, 2));

                return (
                  <tr>
                    <td>
                      <input
                        name="jimun"
                        type="radio"
                        onClick={() => {
                          setIsShowQuill(false);

                          setQuillContent(
                            jimun.quillContent ?? "<p>No content</p>"
                          );

                          if (jimun?.id) {
                            setCurrentFocusedDocId(jimun.id);
                          } else {
                            alert(
                              "When you clicked radio button, but there is no jimun.id"
                            );

                            alert("Ask the dev");
                          }
                        }}
                      />
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
                        onClick={async () => {
                          try {
                            if (!jimun.id) {
                              throw Error("No jimun.id");
                            }

                            await deleteDoc(doc(db, "jimuns", jimun.id));

                            await 데이터_가져오기();

                            setCurrentFocusedDocId("");
                            setCurrentFocusedProblemDocId("");
                            setQuillContent("");
                          } catch (err) {
                            console.error(
                              "When you delete jimun, there is some problem"
                            );
                            console.error(err);
                          }
                          console.log(jimun);
                        }}
                      >
                        삭제
                      </button>

                      <input
                        type={"text"}
                        placeholder={jimun?.order ? jimun?.order : 0}
                        onBlur={async (e) => {
                          // NOTE: 지문의 순서 결정
                          if (e.target.value) {
                            const jimunDocRef = doc(db, "jimuns", jimun.id);

                            try {
                              await updateDoc(jimunDocRef, {
                                order: Number(e.target.value),
                              });

                              alert("Good");
                            } catch (err) {
                              console.error(err);
                              alert("Bad");
                            }
                          }
                        }}
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
                      />
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

        <table className="w-full">
          <thead>
            <th scope="col">선택</th>
            <th scope="col">문제 유형</th>
            <th scope="col">응답 유형</th>
            <th scope="col">해시 태그</th>
            <th scope="col">실행</th>
          </thead>

          <tbody>
            {problemInfos?.map((problemInfo: any, index: number) => {
              return (
                <tr>
                  <td>
                    <input
                      name="jimun"
                      type="radio"
                      onClick={() => {
                        setIsShowQuill(true);

                        setQuillContent(
                          problemInfo.quillContent ?? "<p>No content</p>"
                        );

                        setCurrentFocusedProblemDocId(problemInfo.id);
                      }}
                    />
                  </td>

                  <td>
                    <p>
                      {problemInfo.problemType === 0 ? "(문제 유형 없음)" : ""}
                    </p>
                  </td>

                  <td>{problemInfo.length ?? "0"}</td>

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
                      onClick={async () => {
                        try {
                          if (!problemInfo.id) {
                            throw Error("No problemInfo.id");
                          }

                          await deleteDoc(
                            doc(db, "problemInfo", problemInfo.id)
                          );

                          await 문제_목록_가져오기();
                        } catch (err) {
                          console.error(
                            "When you delete jimun, there is some problem"
                          );
                          console.error(err);
                        }
                        console.log(problemInfo);
                      }}
                    >
                      삭제
                    </button>

                    <input
                      type={"text"}
                      placeholder={problemInfo?.order ? problemInfo?.order : 0}
                      onBlur={async (e) => {
                        // NOTE: 지문의 순서 결정
                        if (e.target.value) {
                          const problemInfoDocRef = doc(
                            db,
                            "problemInfo",
                            problemInfo.id
                          );

                          try {
                            await updateDoc(problemInfoDocRef, {
                              order: Number(e.target.value),
                            });

                            alert("성공적으로 문제의 순서를 설정 했습니다.");

                            const sorted = problemInfos.slice().sort((a, b) => {
                              const orderA = a?.order ?? 0;
                              const orderB = b?.order ?? 0;

                              return orderA - orderB;
                            });

                            setProblemInfos(sorted);
                          } catch (err) {
                            console.error(err);
                            alert("문제의 순서 설정에 실패 했습니다.");
                          }
                        }
                      }}
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
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
            <QuillEditor />
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
  const [image, setImage] = useState(""); // 해설 이미지 주소
  const [responseType, setResponseType] = useRecoilState(
    problemResponseTypeState
  ); // 응답 유형 ("단일 선택", "복수 선택", "단답형")
  const [symbolType, setSymbolType] = useRecoilState(problemSymbolTypeState); // 기호 유형 (100 ~ 700)
  const [correctAnswer, setCorrectAnswer] = useRecoilState(
    problemCorrectAnswerState
  ); // 정답 ("A", "B", "C", "D")
  const [score, setScore] = useRecoilState(problemScoreState); // 배점
  const [hashTag, setHashTag] = useState("");
  const [problemType, setProblemType] = useState(0);
  const [shortAnswer, setShortAnswer] = useRecoilState(shortAnswerState); // 단답형 정답

  const quillContent = useRecoilValue(quillValue);

  const connectedJimunId = useRecoilValue(currentFocusedJimunIdState);
  const [currentFocusedProblemDocId, setCurrentFocusedProblemDocId] =
    useRecoilState(currentFocusedProblemIdState);
  const [currentFocusedProblemDoc, setCurrentFocusedProblemDoc] = useState<any>(
    {}
  );
  const [currentFocusedDocId, setCurrentFocusedDocId] = useRecoilState(
    currentFocusedJimunIdState
  );
  const [problemInfos, setProblemInfos] = useRecoilState(problemInfosState);

  const 해설_이미지_업로드 = async (e) => {
    // TODO: 해설_이미지가 업로드 완료 되었을 때, 미리 보기 보여주기

    try {
      const storageRef = ref(storage, `image/${Date.now()}`);

      await uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            alert("해설 이미지를 성공적으로 업로드 했습니다");

            setImage(url);
          })
          .catch((err) => {
            alert("해설 이미지 업로드에 실패 했습니다");
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const 문제_저장 = async () => {
    const problemInfoCF = collection(db, "problemInfo");
    const jimunsDocRef = doc(db, "jimuns", connectedJimunId);

    if (responseType === "단답형" && !shortAnswer) {
      return alert("단답형 인데, 단답형 정답이 없습니다.");
    } else if (responseType !== "단답형" && shortAnswer) {
      return alert("단답형 아닌데, 단답형 정답이 있습니다.");
    }

    if (!currentFocusedProblemDocId) {
      // NOTE: 문제 최초 저장
      try {
        await addDoc(problemInfoCF, {
          quillContent,
          responseType, // 응답 유형<string>
          symbolType: Number(symbolType), // 기호 유형<number>
          correctAnswer, // 정답
          score: Number(score), // 배점<number>
          problemType: 0, // TODO: Do not hard-coded here
          connectedJimunId,
          shortAnswer: shortAnswer ? shortAnswer : "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const jimunsCF = await getDoc(jimunsDocRef);

        await updateDoc(jimunsDocRef, {
          length: jimunsCF.data()?.length ? jimunsCF.data()?.length + 1 : 1,
        });

        alert("성공적으로 문제를 저장 했습니다.");
      } catch (err) {
        alert("문제 저장에 문제가 있습니다.");

        console.log(err);
      }
    } else {
      // NOTE: 문제 수정
      const problemInfoDocRef = doc(
        db,
        "problemInfo",
        currentFocusedProblemDocId
      );
      const problemInfoDoc = getDoc(problemInfoDocRef);

      try {
        await updateDoc(problemInfoDocRef, {
          quillContent,
          responseType, // 응답 유형<string>
          symbolType: Number(symbolType), // 기호 유형<number>
          correctAnswer, // 정답
          score: Number(score), // 배점<number>
          problemType: 0, // TODO: Do not hard-coded here
          connectedJimunId,
          shortAnswer: shortAnswer ? shortAnswer : "",
          createdAt: (await problemInfoDoc).data()?.createdAt ?? new Date(),
          updatedAt: new Date(),
        });

        alert("성공적으로 문제를 수정 했습니다.");
      } catch (err) {
        alert("문제 수정에 문제가 있습니다.");

        console.log(err);
      }
    }

    const tempArray: any[] = [];

    if (!currentFocusedDocId) {
      setProblemInfos(tempArray);

      return;
    }

    if (currentFocusedDocId) {
      const problemInfoCF = collection(db, "problemInfo");
      const q = query(
        problemInfoCF,
        where("connectedJimunId", "==", currentFocusedDocId)
      );

      const problemInfoDocs = await getDocs(q);

      problemInfoDocs.forEach((probemInfoDoc) => {
        tempArray.push({ id: probemInfoDoc.id, ...probemInfoDoc.data() });
      });

      tempArray.sort((a, b) => {
        const orderA = a?.order ?? 0;
        // @ts-ignore
        const orderB = b?.order ?? 0;

        // @ts-ignore
        return orderA - orderB;
      });

      setProblemInfos(tempArray);
    }
  };

  useEffect(() => {
    const inner = async () => {
      if (currentFocusedProblemDocId) {
        const problemInfoDocRef = doc(
          db,
          "problemInfo",
          currentFocusedProblemDocId
        );
        const problemInfoDoc = await getDoc(problemInfoDocRef);

        setCurrentFocusedProblemDoc(problemInfoDoc.data());
      }
    };

    inner();
  }, [currentFocusedProblemDocId]);

  useEffect(() => {
    if (currentFocusedProblemDoc.responseType) {
      setResponseType(currentFocusedProblemDoc.responseType);
    }

    if (currentFocusedProblemDoc.symbolType) {
      setSymbolType(currentFocusedProblemDoc.symbolType + "");
    }

    if (currentFocusedProblemDoc.correctAnswer) {
      setCorrectAnswer(currentFocusedProblemDoc.correctAnswer);
    }

    if (currentFocusedProblemDoc.score) {
      setScore(currentFocusedProblemDoc.score);
    }

    if (currentFocusedProblemDoc?.shortAnswer) {
      setShortAnswer(currentFocusedProblemDoc.shortAnswer);
    } else {
      setShortAnswer("");
    }
  }, [currentFocusedProblemDoc]);

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

      <div className="text-editor">
        <QuillEditor />
      </div>

      <Spacer height={50} />

      <div className="flex">
        <div className="flex flex-col">
          <p>해설 이미지</p>
          <p>응답 유형</p>
          <p>기호 유형</p>
          <p>정답</p>
          <p>배점</p>
          <p>문제 유형</p>
          <p>단답형 정답</p>
        </div>

        <div className="flex flex-col">
          <input type={"file"} onChange={해설_이미지_업로드} />

          {/* 응답 유형 */}
          <div className="flex">
            {["단일 선택", "복수 선택", "단답형"].map((value, i) => {
              return (
                <>
                  <input
                    id={"mondais"}
                    name={"mondais"}
                    value={value}
                    type={"radio"}
                    checked={responseType === value}
                    onChange={(e) => {
                      setResponseType(e.target.value);
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
              setSymbolType(e.target.value);
            }}
            value={symbolType}
            defaultValue={symbolType}
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
                    checked={correctAnswer === value}
                    onChange={(e) => {
                      setCorrectAnswer(e.target.value);
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

          {/* 단답형 정답 */}
          <input
            type={"text"}
            value={shortAnswer}
            onChange={(e) => {
              setShortAnswer(e.target.value);
            }}
          />
        </div>
      </div>
      {/* TODO: 해설 이미지 input type: image */}

      {/* TODO: 해시 태그 input type: text */}

      <button
        onClick={async () => {
          await 문제_저장();
        }}
        className="rounded-md bg-rose-500 px-5 py-2 text-white"
      >
        {currentFocusedProblemDocId ? "수정" : "저장"}
      </button>
    </div>
  );
}
