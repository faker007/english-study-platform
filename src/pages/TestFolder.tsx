import "react-quill/dist/quill.snow.css";

import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import Spacer from "../components/Common/Spacer";
import { db } from "../firebase";

export default function TestFolder() {
  const [testFolderName, setTestFolderName] = useState("");
  const [testFolders, setTestFolders] = useState([]);

  const 신규_등록 = async () => {
    if (!testFolderName) {
      return alert("시험 폴더명을 입력해주세요");
    }

    const testFolderCollectionRef = collection(db, "testFolder");

    try {
      await addDoc(testFolderCollectionRef, {
        testFolderName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        시험_폴더_가져오기();

        setTestFolderName("");

        alert("신규 등록에 성공 했습니다!");
      } catch (err) {
        alert("신규 등록에 실패 했습니다!");
      }
    } catch (err) {
      console.log(err);

      alert("신규 등록에 실패 했습니다!");
    }
  };

  const 시험_폴더_가져오기 = async () => {
    const tempArray: any[] = [];
    const testFolderCollectionRef = collection(db, "testFolder");

    const testFolderDocs = await getDocs(testFolderCollectionRef);

    testFolderDocs.forEach((testFolderDoc) => {
      tempArray.push({ id: testFolderDoc.id, ...testFolderDoc.data() });
    });

    setTestFolders(tempArray);
  };

  useEffect(() => {
    시험_폴더_가져오기();
  }, []);

  return (
    <div className="max-w-8xl flex flex-col px-32">
      <Spacer height={30} />

      <h1 style={{ fontSize: 26, fontWeight: 700 }}>시험 폴더</h1>

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

      <p>Tip: 아래 목록은 폴더명 순으로 정렬 됩니다.</p>

      <Spacer height={30} />

      <table>
        <thead>
          <th scope="col">No.</th>
          <th scope="col">폴더명</th>
          <th scope="col">실행</th>
        </thead>

        <tbody>
          <tr>
            <td>-</td>

            <td>
              <input
                type="text"
                style={{ border: "1px solid #555", textAlign: "center" }}
                placeholder="시험 폴더명 입력"
                value={testFolderName}
                onChange={(e) => {
                  setTestFolderName(e.target.value);
                }}
              />
            </td>

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

          {testFolders.map((testFolder: any) => {
            return (
              <tr>
                <td>-</td>

                <td>
                  <p style={{ textAlign: "center" }}>
                    {testFolder.testFolderName}
                  </p>
                </td>

                <td>-</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
